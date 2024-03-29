// Import required modules
const express = require("express"); // Express web framework
const app = express(); // Create an Express application
const fs = require("fs"); // File system module
const port = process.env.PORT || 3000; // Port number for the server
const bodyParser = require("body-parser"); // Parse request bodies

// Serve static files from the 'public' directory
app.use(express.static("public")); // Serve static files
app.use("/css", express.static(__dirname + "/public/css")); // CSS files
app.use("/imgs", express.static(__dirname + "/public/imgs")); // Image files
app.use("/js", express.static(__dirname + "/public/js")); // JavaScript files
app.use("/json", express.static(__dirname + "/public/json")); // JSON files

// Set the view engine to EJS
app.set("view engine", "ejs"); // Use EJS for rendering views

// Route for the home page
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html"); // Render the home page
});

// Route for displaying the guestbook
const guestbook = require("./public/json/guestbook.json"); // Load guestbook data
app.get("/guestbook", (req, res) => {
    res.render("guestbook.ejs", { posts: guestbook }); // Render the guestbook page
});

// Route for displaying the new message form
app.get("/newmessage", (req, res) => {
    res.sendFile(__dirname + "/views/newmessage.html"); // Render the new message form
});

// Middleware to parse urlencoded request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse urlencoded bodies

// Route for handling form submission for new messages
app.post("/newmessage", (req, res) => {
    // Read existing guestbook data
    const data = require("./public/json/guestbook.json");
    const date = new Date();
    const id = data.length + 1;

    // Add new message to guestbook data
    data.push({
        id: id,
        username: req.body.username,
        country: req.body.country,
        date: date.toString(),
        message: req.body.message
    });

    // Convert guestbook data to JSON
    const JSONdata = JSON.stringify(data);

    // Write updated guestbook data to file
    fs.writeFile("./public/json/guestbook.json", JSONdata, function (err, data) {
        if (err) throw err;
        console.log("Message has been saved to file!");
        // Send response to client
        res.send("Submitted successfully!\n" + "<a href=\"/newmessage\">Return to the previous page.</a>");
    });
});

// Route for displaying the AJAX message form
app.get("/ajaxmessage", (req, res) => {
    res.sendFile(__dirname + "/views/ajaxmessage.html"); // Render the AJAX message form
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Route for handling AJAX form submission for new messages
app.post("/ajaxmessage", (req, res) => {
    // Read existing guestbook data
    const data2 = require("./public/json/guestbook.json");
    const username = req.body.username;
    const country = req.body.country;
    const date = new Date();
    const message = req.body.message;
    const id = data2.length + 1;

    // Add new message to guestbook data
    data2.push({
        id: id,
        username: username,
        country: country,
        date: date.toString(),
        message: message
    });

    // Convert guestbook data to JSON
    const JSONdata2 = JSON.stringify(data2);

    // Write updated guestbook data to file
    fs.writeFile("./public/json/guestbook.json", JSONdata2, function (err, data) {
        if (err) {
            console.error(err);
            res.status(500).send("Error saving message to file");
            return;
        }
        console.log("AJAX message has been saved to file!");
        // Send updated guestbook data as response
        res.json(data2);
    });
});

// Start the server
app.listen(port, () => console.log("Server is listening on port " + port)); // Start the server and listen for requests
