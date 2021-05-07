const mongoose = require("mongoose");

const urlPattern = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

const urlSchema = new mongoose.Schema({
    original_url: {
        type: String,
        required: true,
        validate: {
            validator: (url) => urlPattern.test(url),
            message: (url) => `${url.value} is not a valid URL`,
        },
    },
    short_url: { type: Number, required: true, index: true, unique: true },
});

const URL = mongoose.model("URL", urlSchema);

function addLongURL(url) {
    const promise = getLastID();

    return promise
        .then((doc) => {
            let short = doc[0] ? ++doc[0]["short_url"] : 1;

            const obj = { original_url: url, short_url: short };

            const document = new URL(obj);

            return document.save();
        })
        .catch((err) => {
            console.log("Error submitting the URL to the database:", err);
        });
}

function getShortURL(url) {
    return URL.findOne({ short_url: url }).exec();
}

function getLastID() {
    return URL.find({}).sort({ short_url: "desc", test: -1 }).limit(1).exec();
}

module.exports = { addLongURL, getShortURL };
