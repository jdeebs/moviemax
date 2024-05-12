// Same key used in the JWTStrategy
const jwtSecret = "your_jwt_secret";

const jwt = require("jsonwebtoken"),
  passport = require("passport");
const { User } = require("./models");

// Local passport file
require("./passport");

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

// POST login
module.exports = (router) => {
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
