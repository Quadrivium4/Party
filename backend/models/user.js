const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
    },
    parties: [],
    oldParties: [],
    stats: {
        numberOfParties: 0,
        ratings: 0,
    },
    tokens: [],
    tickets: [],
    paypalBusinessId: {
        type: String,
        trim: true
    },
    profileImg: {
        type: String
    }
});

const User = mongoose.model("User", UserSchema);
module.exports = User