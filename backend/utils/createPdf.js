
const fs = require("fs")
const fsPromises = require("fs/promises");
const PDFDocument = require('pdfkit');
const Party = require("../models/party");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const User = require("../models/user");

async function createPdfList(partyId) {
	//const cursor = await mongoose.files.find({ _id: ObjectId("64bd2ab2efb8035c6638abcf") });

	const party = await Party.findById(partyId);
	const colors = {
		dark: "#000014",
		medium: "#0F1437",
		light: "#233264"
	}
	const doc = new PDFDocument;
	let curPosY = 0;
	const { id } = doc.pipe(mongoose.files.openUploadStream("list.pdf"));
	doc
		.fontSize(20)
		.text(party.name, 100, 100)
		.fontSize(18)
	for (let i = 0; i < party.people.length; i++) {
		const personId = party.people[i];
		const person = await User.findById(personId);
		doc.text(person.name, 100, i * 20 + 150);
	}
	doc.end()
	console.log("finished");
	return id;
}
module.exports = {createPdfList}