// Require necessary modules
const express = require("express"),
  morgan = require("morgan"),
  fs = require("fs"),
  path = require("path");

// Create an Express application
const app = express();

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

// Create an array of objects for top 10 movies data
let topMovies = [
  {
    title: "The Shawshank Redemption",
    year: 1994,
    director: "Frank Darabont",
    cast: ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
    imdbRating: 9.3,
    description:
      "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/I/51DPJlHuWgL._AC_.jpg",
  },
  {
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    cast: ["Marlon Brando", "Al Pacino", "James Caan"],
    imdbRating: 9.2,
    description:
      "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/I/51ZBnnNzvyL._AC_.jpg",
  },
  {
    title: "The Godfather: Part II",
    year: 1974,
    director: "Francis Ford Coppola",
    cast: ["Al Pacino", "Robert De Niro", "Robert Duvall"],
    imdbRating: 9.0,
    description:
      "The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/I/41t2+cWZizL._AC_.jpg",
  },
  {
    title: "The Dark Knight",
    year: 2008,
    director: "Christopher Nolan",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    imdbRating: 9.0,
    description:
      "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: "Action",
    imageUrl: "https://m.media-amazon.com/images/I/51Lu09Yi8rL._AC_.jpg",
  },
  {
    title: "12 Angry Men",
    year: 1957,
    director: "Sidney Lumet",
    cast: ["Henry Fonda", "Lee J. Cobb", "Martin Balsam"],
    imdbRating: 8.9,
    description:
      "A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/I/51aAwtB1GiL._AC_.jpg",
  },
  {
    title: "Schindler's List",
    year: 1993,
    director: "Steven Spielberg",
    cast: ["Liam Neeson", "Ralph Fiennes", "Ben Kingsley"],
    imdbRating: 8.9,
    description:
      "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    genre: "Biography",
    imageUrl: "https://m.media-amazon.com/images/I/61agSwaBqVL._AC_.jpg",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Viggo Mortensen", "Ian McKellen"],
    imdbRating: 8.9,
    description:
      "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
    genre: "Adventure",
    imageUrl: "https://m.media-amazon.com/images/I/81UWg+0DZtL._AC_.jpg",
  },
  {
    title: "Pulp Fiction",
    year: 1994,
    director: "Quentin Tarantino",
    cast: ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
    imdbRating: 8.9,
    description:
      "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
    genre: "Crime",
    imageUrl: "https://m.media-amazon.com/images/I/51UWgWpW3IL._AC_.jpg",
  },
  {
    title: "The Good, the Bad and the Ugly",
    year: 1966,
    director: "Sergio Leone",
    cast: ["Clint Eastwood", "Eli Wallach", "Lee Van Cleef"],
    imdbRating: 8.8,
    description:
      "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.",
    genre: "Western",
    imageUrl: "https://m.media-amazon.com/images/I/51d5LWp39BL._AC_.jpg",
  },
  {
    title: "Fight Club",
    year: 1999,
    director: "David Fincher",
    cast: ["Brad Pitt", "Edward Norton", "Helena Bonham Carter"],
    imdbRating: 8.8,
    description:
      "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
    genre: "Drama",
    imageUrl: "https://m.media-amazon.com/images/I/51uv6FqqtiL._AC_.jpg",
  },
];

// Logger middleware using Morgan
app.use(morgan("combined", { stream: accessLogStream }));

// Server static files from the public folder
app.use(express.static("public"));

// READ top 10 movies data as JSON
app.get("/movies", (req, res) => {
  res.status(200).json(topMovies);
});

// READ movie by title
app.get("/movies/:title", (req, res) => {
  const { title } = req.params;
  const movie = movies.find((movie) => movie.title === title);

  if (movie) {
    res.status(200).json(movie);
  } else {
    res.status(400).send("No such movie");
  }
});

// READ movie by genre
app.get("/movies/genre/:genreName", (req, res) => {
  const { genreName } = req.params;
  const genre = movies.find((movie) => movie.genre === genreName);

  if (genre) {
    res.status(200).json(genre);
  } else {
    res.status(400).send("No such genre");
  }
});

// Define GET endpoint for the root URL with a default textual response
app.get("/", (req, res) => {
  res.send("Welcome to MovieMax!");
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
