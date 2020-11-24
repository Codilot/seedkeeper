let express = require("express");
let router = express.Router();
let path = require("path");

// Home route
router.get("/", (req, res) => {
    let responseText = "Welcome to my seedsaver app!";
    responseText += "<small>Requested at: " + req.requestTime + "</small>";
    res.send(responseText);
});
// Documentation route
router.get("/documentation", (req, res) => {
    res.sendFile("/documentation.html", {
        root: path.join(__dirname, "../public"),
    });
});

module.exports = router;
