const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({


    username: {
        type: String,
        required: [true, 'Enter user name'],
        trim: true,
        lowercase: true

    },

    firstname: {
        type: String,
        required: [true, 'Enter first name'],
        trim: true,
        lowercase: true

    },
    lastname: {
        type: String,
        required: [true, 'Enter last name'],
        trim: true,
        lowercase: true

    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        trim: true,
        lowercase: true

    },

    createon: {
        type: Date,
        default: Date.now,

    }

});


const User = mongoose.model("User", UserSchema);
module.exports = User;