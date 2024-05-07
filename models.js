const mongoose = require("mongoose");

// Define movie schema
let movieSchema = mongoose.Schema({
  Title: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
    required: true,
  },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

// Define user schema
let userSchema = mongoose.Schema({
  Username: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
  },
  Birthday: Date,
  FavoriteMovies: [
    {
    // Array of movie IDs
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
    },
  ],
});

// Create Movie model
let Movie = mongoose.model("Movie", movieSchema);
// Create User model
let User = mongoose.model("User", userSchema);

// Export models
module.exports.Movie = Movie;
module.exports.User = User;
