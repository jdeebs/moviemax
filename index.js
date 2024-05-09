// Require necessary modules
const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path"),
  uuid = require("uuid"),
  mongoose = require("mongoose"),
  Models = require("./models.js");
const { title } = require("process");

// Create an Express application
const app = express();
// Include body-parser with Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Reference movie and user Mongoose models
const Movies = Models.Movie;
const Users = Models.User;

// Allow Mongoose to connect to the database
mongoose.connect("mongodb://localhost:27017/movieMaxDB");

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// Create an array of objects for users
let users = [
  {
    id: 1,
    name: "Joe",
    favoriteMovies: [],
  },
  {
    id: 2,
    name: "Rob",
    favoriteMovies: ["The Shawshank Redemption"],
  },
];

// Create an array of objects for top 10 movies data
let topMovies = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    imdbRating: 9.3,
    genre: {
      name: "Drama",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    },
  },
  {
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    imdbRating: 9.2,
    genre: {
      name: "Crime",
      description:
        "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    },
  },
  {
    title: "The Godfather: Part II",
    year: 1974,
    director: "Francis Ford Coppola",
    cast: ["Al Pacino", "Robert De Niro", "Robert Duvall"],
    imdbRating: 9.0,
    genre: {
      name: "Crime",
      description:
        "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    },
  },
  {
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    imdbRating: 9.0,
    genre: {
      name: "Action",
      description:
        "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    },
  },
  {
    title: "12 Angry Men",
    year: 1957,
    director: "Sidney Lumet",
    cast: ["Henry Fonda", "Lee J. Cobb", "Martin Balsam"],
    imdbRating: 8.9,
    genre: {
      name: "Drama",
      description:
        "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    },
  },
  {
    title: "Schindler's List",
    year: 1993,
    director: "Steven Spielberg",
    cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
    imdbRating: 8.9,
    genre: {
      name: "Biography",
      description:
        "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    },
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
    imdbRating: 8.9,
    genre: {
      name: "Adventure",
      description:
        "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    },
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    imdbRating: 8.9,
    genre: {
      name: "Crime",
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    },
  },
  {
    title: "The Good, the Bad and the Ugly",
    year: 1966,
    director: "Sergio Leone",
    cast: ["Clint Eastwood", "Eli Wallach", "Lee Van Cleef"],
    imdbRating: 8.8,
    genre: {
      name: "Western",
      description:
        "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    },
  },
  {
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    imdbRating: 8.8,
    genre: {
      name: "Drama",
      description:
        "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    },
  },
];

// Logger middleware using Morgan
app.use(morgan("combined", { stream: accessLogStream }));

// Server static files from the public folder
app.use(express.static("public"));

// CREATE new user
app.post("/users", async (req, res) => {
  await Users.findOne({
    Username: req.body.Username,
  })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

// CREATE/add new favorite movies to user by movie ID
app.post("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $push: { FavoriteMovies: req.params.MovieID },
    },
    { new: true } // Make sure the updated document is returned
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// READ endpoint for the root URL, respond with a default textual response
app.get("/", (req, res) => {
  res.send("Welcome to MovieMax!");
});

// READ top 10 movies data as JSON
app.get("/movies", (req, res) => {
  res.status(200).json(topMovies);
});

// READ movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = topMovies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie");
  }
});

// READ movie by genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const moviesWithGenre = topMovies.filter(
    (movie) => movie.genre.name === genreName
  );
  const genre = topMovies.find((movie) => movie.genre.name === genreName).genre;

  if (moviesWithGenre.length > 0) {
    const moviesWithTitle = moviesWithGenre.map((movie) => {
      return {
        title: movie.title,
        genre: movie.genre,
      };
    });
    res.status(200).json(moviesWithTitle);
  } else {
    res.status(400).send("No movies found for the given genre");
  }
});

// READ movie by director
app.get("/movies/director/:directorName", (req, res) => {
  const { directorName } = req.params;
  const moviesWithDirector = topMovies.filter(
    (movie) => movie.director === directorName
  );

  if (moviesWithDirector.length > 0) {
    const titleAndDirector = moviesWithDirector.map((movie) => {
      return {
        title: movie.title,
        director: movie.director,
      };
    });
    res.status(200).json(titleAndDirector);
  } else {
    res.status(400).send("No movies found with the given director");
  }
});

// READ user by username
app.get("/users/:Username", async (req, res) => {
  await Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// UPDATE users name by ID
app.patch("/users/:id", (req, res) => {
  const { id } = req.params;
  const updateUser = req.body;

  let user = users.find((user) => user.id == id);

  if (user) {
    user.name = updateUser.name;
    res.status(200).json(user);
  } else {
    res.status(400).send("No such user");
  }
});

// UPDATE user by username
app.put("/users/:Username", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  ) // Make sure the updated document is returned
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// DELETE user by username
app.delete("/users/:Username", async (req, res) => {
  await Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + " was not found.");
      } else {
        res.status(200).send(req.params.Username + " was deleted.");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// DELETE favorite movies from user by movie ID
app.delete("/users/:Username/movies/:MovieID", async (req, res) => {
  await Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $pull: { FavoriteMovies: req.params.MovieID },
    },
    { new: true } // Make sure the updated document is returned
  )
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Listen for requests on port 8080
app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
