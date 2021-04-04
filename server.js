// Require express module
const express = require("express");
// Require cors module
const cors = require("cors");

// Declare a new sever instance
const app = express();
// Declare the port to be used by the server
const port = 3000;
// Declare an object for storing data
const projectData = {
    date: null,
    temp: null,
    content: null
};

// Body Parser became deprecated since express v4.16.0
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Allow cross-origin policy for all clients
app.use(cors());
// Serve static files from website directory
app.use(express.static("website"));

// Add a route for recieving data
app.post("/addEntry", (req, res) => {
    // Store recieved data in projectData object
    projectData.date = req.body.date;
    projectData.temp = req.body.temp;
    projectData.content = req.body.content;
    // Send a success msg
    res.send("OK");
});

// Add a route for sending stored data
app.get("/getRecent", (req, res) => {
    // Send stored data
    res.send(projectData);
});

// Start listening for requests
app.listen(port, () => {
    // Log a success msg to the console
    console.log("\x1b[32m%s\x1b[0m",
        `Server is running at http://localhost:${port}/`);
})