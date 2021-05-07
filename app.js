require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

// const indexRouter = require("./routes/index");
// const apiRouter = require("./routes/api");

const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then((conn) => {
        console.log("DB connected successfully");

        const app = express();

        app.use(cors({ optionsSuccessStatus: 200 }));

        app.use(express.static(path.join(__dirname, "public")));

        // app.use("/", indexRouter);
        // app.use("/api", apiRouter);

        app.get("/", (req, res) => {
            res.sendFile(path.join(__dirname, "views/index.html"));
        });

        const bodyParser = require("body-parser");

        const axios = require("axios");

        const dbOp = require("./db/db");

        app.get("/api/shorturl/:url", (req, res) => {
            const url = Number(req.params["url"]);

            dbOp.getShortURL(url)
                .then((doc) => {
                    if (!doc) {
                        return res.json({
                            error: `Shorturl ${url} does not exist`,
                        });
                    }

                    res.redirect(doc["long-url"]);
                })
                .catch((err) => res.json({ error: "err" }));
        });

        // Parse the request body to make the url available
        // on req.body["long-url"]
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());

        app.post("/api/shorturl", (req, res) => {
            const url = req.body["long-url"];

            const urlErrors = {
                ENOTFOUND: "Invalid hostname",
            };

            axios
                .get(url)
                .then((response) => {
                    dbOp.addLongURL(url).then((doc) => {
                        res.json({
                            original_url: doc["long-url"],
                            short_url: doc["short-url"],
                        });
                    });
                })
                .catch((err) => {
                    res.json({ error: urlErrors[err.code] });
                });
        });

        app.listen(port, () => {
            console.log(`Express is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
