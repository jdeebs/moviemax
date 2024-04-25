// Import the http, url, and fs modules
const http = require("http");
const url = require("url");
const fs = require("fs");

// Create an http server using the createServer method of the http module
http
  .createServer((request, response) => {
    // Extract the URL requested by the client
    let requestedUrl = request.url;
    let filePath = "";

    // Parse the requested URL for the word "documentation"
    if (requestedUrl.includes("documentation")) {
      filePath = (__dirname + "/documentation.html");
    } else {
      filePath = (__dirname + "index.html");
    }

    // Use fs module to log both requested URL and a timestamp to log.txt file
    fs.appendFile('log.txt', 'URL: ' + requestedUrl + '\nTimestamp: ' + new Date() + '\n\n', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Added to log.');
        }
    });
  })
  .listen(8080);
