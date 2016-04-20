// ############### web server by express
var express = require("express");
var app = express();

var dotenv = require('dotenv').config();

//controllers
var htmlController = require("./controllers/htmlController");
var passportController = require("./controllers/passportController");
var dbControllers = require("./controllers/dbControllers");
var uploadController = require("./controllers/uploadController");

//static files
app.use("/assets", express.static(__dirname + "/public"));
app.use("/html", express.static(__dirname + "/views/static"));

// EJS engine
app.set("view engine", "ejs");

//controllers
htmlController(app);
passportController(app);
dbControllers(app);
uploadController(app);

//environmental variables on server or 3000
var port = process.env.PORT || 3000;
app.listen(port);