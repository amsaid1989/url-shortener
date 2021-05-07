const mongoose = require("mongoose");

const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const urlSchema = new mongoose.Schema({
    "long-url": {
        type: String,
        required: true,
        validate: {
            validator: (url) => urlPattern.test(url),
            message: (url) => `${url.value} is not a valid URL`,
        },
    },
    "short-url": { type: Number, required: true, index: true, unique: true },
});

const URL = mongoose.model("URL", urlSchema);

function addLongURL(url) {
    let short = 1;

    return getLastID().then((doc) => {
        short = ++doc[0]["short-url"];

        const obj = { "long-url": url, "short-url": short };

        const document = new URL(obj);

        return document.save();
    });
}

function getShortURL(url) {
    return URL.findOne({ "short-url": url });
}

function getLastID() {
    return URL.find({}).sort({ "short-url": "desc", test: -1 }).limit(1);
}

module.exports = { addLongURL, getShortURL };
