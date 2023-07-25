
const mongoose = require("mongoose");

const PartySchema = new mongoose.Schema({
    name: String,
    description: String,
    location: String,
    coords: {x: Number, y: Number},
    price: Number,
    creationDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    date: Date,
    purchaseDeadline: Date,
    people: [],
    pdfList: String,
    capacity: Number,
    images: Array,
    owner: String
})
const Party = mongoose.model("Party", PartySchema);
module.exports = Party;