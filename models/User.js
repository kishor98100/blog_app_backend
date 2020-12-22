const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
});

module.exports = mongoose.model("User", User);