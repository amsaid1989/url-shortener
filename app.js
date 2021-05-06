require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");

const cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

const indexRouter = require("./routes/index");

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);

app.listen(process.env.PORT, () => {
    console.log(`Express is listening on port ${process.env.PORT}`);
});
