// Import required modules
const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  Models = require("./models.js"),
  passportJWT = require("passport-jwt");

// Get user model and passport JWT components
let Users = Models.User,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

/**
 * Authenticate users using username and password.
 * 
 * @name LocalStrategy
 * @function
 * @param {Object} options - The fields from the request body used for authentication.
 * @param {string} options.usernameField - The field in the request body representing the username.
 * @param {string} options.passwordField - The field in the request body representing the password.
 * @param {Function} verify - A callback that verifies the username and password.
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "Username", // Username field in request body
      passwordField: "Password", // Password field in request body
    },
    async (username, password, callback) => {
      console.log(`${username} ${password}`);
      // Find user by username
      await Users.findOne({ Username: username })
        .then((user) => {
          if (!user) {
            console.log("Incorrect username");
            return callback(null, false, {
              message: "Incorrect username or password.",
            });
          }
          if (!user.validatePassword(password)) {
            console.log("incorrect password");
            return callback(null, false, { message: "Incorrect password." });
          }
          console.log("Finished");
          // Return user if authentication succeeds
          return callback(null, user);
        })
        .catch((error) => {
          if (error) {
            console.log(error);
            return callback(error);
          }
        });
    }
  )
);

/**
 * Authenticate users using JSON Web Tokens.
 * 
 * @name JWTStrategy
 * @function
 * @param {Object} options - The options for JWT authentication.
 * @param {Function} verify - A callback function that handles the verification of the JWT.
 */
passport.use(
  new JWTStrategy(
    {
      // Extract JWT token from Authorization header
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      // Secret key for JWT signature verification
      secretOrKey: "your_jwt_secret",
    },
    async (jwtPayload, callback) => {
      // Find user by ID extracted from JWT payload
      return await Users.findById(jwtPayload._id)
        .then((user) => {
          // Return user if found
          return callback(null, user);
        })
        .catch((error) => {
          // Return error if user not found
          return callback(error);
        });
    }
  )
);
