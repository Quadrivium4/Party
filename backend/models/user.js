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
        rquired: true
    },
    tokens: [],
    tickets: [],
    stripeId: {
        type: String,
        trim: true,
    },
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