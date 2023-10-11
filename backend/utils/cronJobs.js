const mongoose = require("mongoose");
const Party = require("../models/party");
const User = require("../models/user");
const { createPdfList } = require("./createPdf");
const sendMail = require("./sendMail");
const { ObjectId } = require("mongodb");
const { deleteFile } = require("./files");
const OldParty = require("../models/oldParty");
const { deletePartyImages } = require("../functions/party");
const CronJob = require("cron").CronJob

async function setCronJobs(){
	console.log("setting cron jobs...")
	setAllPartiesExpireDate();
}
async function deleteExpiredParty(party) {
	const owner = await User.findById(party.owner);
	const deletedParty = await Party.findByIdAndDelete(party.id);
	const oldParty = await OldParty.create({ name: deletedParty.name, date: deletedParty.date, peopleNumber: deletedParty.people.length, owner: owner.id });
	await User.findByIdAndUpdate(owner.id, {
		$push: { oldParties: oldParty.id },
		$pull: { parties: { $eq: deletedParty._id.toString() } }
	})
	if(deletedParty.pdfList) await deleteFile(deletedParty.pdfList);
	deletePartyImages(deletedParty.images);
	console.log(`Expired party has been deleted: ` + party.name)
}
async function closeExpiredParty(party){
	const owner = await User.findById(party.owner);
	if(party.pdfList) return;
	
	const pdfId = await createPdfList(party.id);
	const stream = await mongoose.files.openDownloadStream(ObjectId(pdfId));
	const updatedParty = await Party.findByIdAndUpdate(party.id, { pdfList: pdfId }, { new: true });
	await sendMail({ to: owner.email, subject: "Your party is ready", body: `<h1>Hi ${owner.name}</h1>`, attachments: [{ filename: "list.pdf", content: stream }] })
}
function inMilliseconds(date) {
	return new Date(date).getTime();
}
async function onPartyExpires(party){
	const date = new Date(party.date);
	const purchaseDeadlineDate = new Date(party.purchaseDeadline);
	console.log(inMilliseconds(date),Date.now());
	if (inMilliseconds(purchaseDeadlineDate) <Date.now()) closeExpiredParty(party);
	else {
		const closePartyJob = new CronJob(new Date(party.purchaseDeadline), () => closeExpiredParty(party))
		closePartyJob.start()
	}
	console.log("date....", date)
	if (inMilliseconds(date) < Date.now()) deleteExpiredParty(party);
	else{
		const deletePartyJob = new CronJob(date, () =>deleteExpiredParty(party))
		deletePartyJob.start()
	}

	

}
async function setAllPartiesExpireDate(){
	/*Party.deleteMany({date: {$lte: Date.now()}}).then(deletedParties=>{
		console.log(deletedParties.length,"Deleted Parties")
	})*/
	//console.log({ date: new Date(Date.now() + 240 * 1000) })
	//await Party.updateMany({ purchaseDeadline: new Date(Date.now() + 5 * 1000), date: new Date(Date.now() + 10 * 1000) })
	
	const parties = await Party.find({});
	for (let i = 0; i < parties.length; i++) {
		const party = parties[i];
		onPartyExpires(party);
	}
}


module.exports = {
	setCronJobs,
	onPartyExpires
}