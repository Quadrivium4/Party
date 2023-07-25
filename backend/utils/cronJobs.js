const mongoose = require("mongoose");
const Party = require("../models/party");
const User = require("../models/user");
const { createPdfList } = require("./createPdf");
const sendMail = require("./sendMail");
const { ObjectId } = require("mongodb");
const { deleteFile } = require("./files");
const CronJob = require("cron").CronJob

async function setCronJobs(){
	console.log("setting cron jobs...")
	setAllPartiesExpireDate();
}
async function onPartyExpires(partyId){
	const party = await Party.findById(partyId);
	const owner = await User.findById(party.owner);
	const date = new Date(party.date);
	// TODO delete the line below...
	//if (party.name != "Milan Party") return console.log("not milan party");
	const deletePartyJob = new CronJob(date, async () => {
		//sendMail(`<h1></h1>`, owner.email, "Party is ready!");
		const deletedParty = await Party.findByIdAndDelete(party.id);
		await deleteFile(deletedParty.pdfList);
		console.log(`Expired party has been deleted: ` + party.name)
	})
	deletePartyJob.start()
	const closePartyJob = new CronJob(new Date(party.purchaseDeadline), async ()=>{
		console.log("trying")
		
			console.log("doing cron job")
			const pdfId = await createPdfList(party.id);
			const stream = await mongoose.files.openDownloadStream(ObjectId(pdfId));
			const updatedParty = await Party.findByIdAndUpdate(party.id, {pdfList: pdfId},{new: true});
			await sendMail({ to: owner.email, subject: "Your party is ready", body: `<h1>Hi ${owner.name}</h1>`, attachments: [{ filename: "list.pdf", content: stream }] })
			console.log("job done")
		
		
	})
	closePartyJob.start()

}
async function setAllPartiesExpireDate(){
	/*Party.deleteMany({date: {$lte: Date.now()}}).then(deletedParties=>{
		console.log(deletedParties.length,"Deleted Parties")
	})*/
	//console.log({ date: new Date(Date.now() + 240 * 1000) })
	await Party.updateMany({ purchaseDeadline: new Date(Date.now() + 5 * 1000), date: new Date(Date.now() + 10 * 1000) })
	
	const parties = await Party.find({});
	for (let i = 0; i < parties.length; i++) {
		const party = parties[i];
		onPartyExpires(party.id);
	}
}


module.exports = {
	setCronJobs,
	onPartyExpires
}