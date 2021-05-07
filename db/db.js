require("dotenv").config();

const events = require("events");

const eventEmitter = new events.EventEmitter();

const mongoose = require("mongoose");

let nextID;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});

let connection = mongoose.connection;

connection.on("error", console.error.bind(console, "DB connection error"));

connection.once("open", () => {
    console.log("connected to DB successfully");
    getLastID();
});

const urlSchema = new mongoose.Schema({
    "long-url": { type: String, required: true },
    "short-url": { type: Number, required: true, index: true, unique: true },
});

const URL = mongoose.model("URL", urlSchema);

function addURL(url) {
    const obj = { "long-url": url, "short-url": nextID };

    const document = new URL(obj);

    document.save((err, doc) => {
        if (err) {
            return console.log(err);
        }

        console.log(`Added ${url} successfully`);

        ++nextID;
    });
}

function getLastID() {
    URL.find({})
        .sort({ "short-url": "desc", test: -1 })
        .limit(1)
        .exec((err, doc) => {
            if (err) {
                return console.log(err);
            }

            let id = doc[0]["short-url"];

            nextID = id ? ++id : 1;

            eventEmitter.emit("dbinitialised");
        });
}

module.exports = { eventEmitter, addURL };
