// Dependencies and required modules
const jwt = require("jsonwebtoken"),
  passport = require("passport");
const { User } = require("./models");

// Local passport file
require("./passport");

/**
 * Secret key used in the JWTStrategy.
 * @constant {string} jwtSecret
 */
const jwtSecret = "your_jwt_secret";

/**
 * Generates a JWT token for the user.
 * 
 * @function generateJWTToken
 * @param {Object} user - The user object.
 * @returns {string} - The signed JWT token.
 */
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    // Username encoded in the JWT
    subject: user.Username,
    // Token will expire in 7 days
    expiresIn: "7d",
    // Sign/Encode the values of the JWT
    algorithm: "HS256",
  });
};

/**
 * POST login route to authenticate users.
 * @function
 * @param {Object} router - The Express router object.
 */
module.exports = (router) => {
  /**
   * @name /login
   * @function
   * @inner
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  router.post("/login", (req, res) => {
    passport.authenticate("local", { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: "Something is not right",
          user: user,
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
};
