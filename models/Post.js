const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const Post = Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    publishedAt: {
        type: Number,
        default: Date.now()
    },
});

module.exports = mongoose.model("Post", Post);