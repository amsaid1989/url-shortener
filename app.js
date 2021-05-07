require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");

app.use(express.static(path.join(__dirname, "public")));

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then((conn) => {
        console.log("DB connected successfully");

        app.use("/", indexRouter);
        app.use("/api", apiRouter);
    })
    .catch((err) => {
        console.log(err);
    });

app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port ${process.env.PORT}`);
});
