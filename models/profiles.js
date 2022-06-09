const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./users');

const profileSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    fullname: String,
    firstname: String,
    lastname: String,
    email: {
        type: String,
        unique: true,
    },
    country: String,
    role: String,
    summary: String,
    links: [
        {
            title: String,
            url: String,
            description: String,
        }
    ],
}, {
   timestamps: true,
});

module.exports = mongoose.model('Profile', profileSchema);