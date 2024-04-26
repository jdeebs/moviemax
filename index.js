const express = require("express"),
  morgan = require("morgan");
(fs = require("fs")), (path = require("path"));

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

app.use(morgan("combined", { stream: accessLogStream }));

app.get("/", (req, res) => {
  res.send("Welcome to my app!");
});

app.get("/secreturl", (req, res) => {
  res.send("This is a secret url with super top-secret content.");
});

app.listen(8080, () => {
  console.log("Your app is listening on port 8080.");
});
