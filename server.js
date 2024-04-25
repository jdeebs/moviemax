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

    if (requestedUrl.includes("documentation.html")) {
      filePath = "./documentation.html";
    } else {
      filePath = "./index.html";
    }
  })
  .listen(8080);
