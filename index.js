const express = require("express"),
    app = express(),
    morgan = require("morgan"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    passport = require("passport"),
    cors = require("cors"),
    mongoose = require("mongoose");

require("dotenv").config();

var MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

const corsConfig = require("./middlewares/cors");
const appRouter = require("./routes");

// Passport auth strategies
require("./middlewares/passport");

//Custom Middleware
let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
};

// Register Middleware
app.use(morgan("common"));
app.use(express.static("public")); // shorthand for app.use('/', express.static('public'));
app.use(requestTime);
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(bodyParser.json());
app.use(methodOverride());
app.use(passport.initialize());
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

// Cors
app.use(cors(corsConfig));

//Route Prefixes
app.use("/", appRouter);

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
    console.log("Listening on Port " + port);
});
