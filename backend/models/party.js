
const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    coords: {x: Number, y: Number},
    price: Number,
    images: Array,
    owner: String
})
const Party = mongoose.model("Party", PartySchema);
module.exports = Party;