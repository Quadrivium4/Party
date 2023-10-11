const mongoose = require("mongoose");

const OldPartySchema = new mongoose.Schema({
	name: String,
	date: Date,
	peopleNumber: Number,
	owner: String,
})
const OldParty = mongoose.model("OldParty", OldPartySchema);
module.exports = OldParty;