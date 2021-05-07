require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

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

        app.use("/", indexRouter);
        app.use("/api", apiRouter);

        app.listen(process.env.PORT, () => {
            console.log(`Express is listening on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
