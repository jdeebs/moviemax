// Require necessary modules
const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  Models = require("./models.js");
const { title } = require("process");
const { check, validationResult } = require("express-validator");

// Create an Express application
const app = express();
// Include body-parser with Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import CORS
const cors = require("cors");
let allowedOrigins = [
  "http://localhost:8080",
  "http://localhost:4200",
  "http://localhost:1234",
  "https://jdeebs-moviemax.netlify.app",
  "https://jdeebs.github.io"
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          "The CORS policy for this application doesn't allow access from origin " +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Import auth and require Passport module
let auth = require("./auth")(app); // (app) argument ensures Express is available in auth.js
const passport = require("passport");
require("passport");

// Reference movie and user Mongoose models
const Movies = Models.Movie;
const Users = Models.User;

// Allow Mongoose to connect to the database LOCALLY
// mongoose.connect("mongodb://localhost:27017/movieMaxDB");

// Allow Mongoose to connect to the database REMOTELY
mongoose.connect(process.env.CONNECTION_URI);

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// Logger middleware using Morgan
app.use(morgan("combined", { stream: accessLogStream }));

// Server static files from the public folder
app.use(express.static("public"));

// CREATE new user
app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({
      Username: req.body.Username,
    })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          return Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              return res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              return res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// CREATE/add new favorite movies to user by movie ID
app.post(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true } // Make sure the updated document is returned
    )
      .then((updatedUser) => {
        return res.json(updatedUser);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// READ endpoint for the root URL, respond with a default textual response
app.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  return res.send("Welcome to MovieMax!");
});

// READ all movie data
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find()
      .then((movies) => {
        return res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// READ movie by title
app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        return res.json(movie);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// READ movie by genre
app.get(
  "/movies/genre/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "Genre.Name": req.params.Name })
      .then((movies) => {
        return res.json(movies);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// READ movie by director
app.get(
  "/movies/director/:Name",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Movies.find({ "Director.Name": req.params.Name })
      .then((movies) => {
        return res.json(movies);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// READ user by username
app.get(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// UPDATE user by username
app.put(
  "/users/:Username",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);

    // Condition to check user
    if (req.user.Username !== req.params.Username) {
      return res.status(400).send("Permission denied");
    }
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }
    ) // Make sure the updated document is returned
      .then((updatedUser) => {
        return res.status(201).json(updatedUser);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// DELETE user by username
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndDelete({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          return res.status(400).json(req.params.Username + " was not found.");
        } else {
          return res.status(200).json(req.params.Username + " has been deleted.");
        }
      })
      .catch((error) => {
        console.error("Error details:", error);
        return res.status(500).json({ message: "An error occurred", error: error });
      });
  }
);

// DELETE favorite movies from user by movie ID
app.delete(
  "/users/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    await Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true } // Make sure the updated document is returned
    )
      .then((updatedUser) => {
        return res.json(updatedUser);
      })
      .catch((error) => {
        console.error(error);
        return res.status(500).send("Error: " + error);
      });
  }
);

// Error-handling middleware
app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");
});

// Listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});
