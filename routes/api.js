const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");

// Parse the request body to make the url available
// on req.body["long-url"]
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/shorturl", (req, res) => {
    res.send("Data sent successfully");
});

module.exports = router;
