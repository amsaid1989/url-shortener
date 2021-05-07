const express = require("express");
const router = express.Router();

const bodyParser = require("body-parser");

const axios = require("axios");

const dbOp = require("../db/db");

router.get("/shorturl/:url", (req, res) => {
    const url = Number(req.params["url"]);

    dbOp.getShortURL(url)
        .then((doc) => {
            if (!doc) {
                return res.json({ error: `Shorturl ${url} does not exist` });
            }

            res.redirect(doc["original_url"]);
        })
        .catch((err) => res.json({ error: "err" }));
});

// Parse the request body to make the url available
// on req.body["url"]
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post("/shorturl", (req, res) => {
    const url = req.body["url"];

    const urlErrors = {
        ENOTFOUND: "Invalid hostname",
    };

    axios
        .get(url)
        .then((response) => {
            dbOp.addLongURL(url).then((doc) => {
                res.json({
                    original_url: doc["original_url"],
                    short_url: doc["short_url"],
                });
            });
        })
        .catch((err) => {
            res.json({ error: urlErrors[err.code] });
        });
});

module.exports = router;
