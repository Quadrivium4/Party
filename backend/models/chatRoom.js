const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
	party: String,
	admin: String,
	people: [],
	messages: []
})
const ChatRoom = mongoose.model("ChatRoom", ChatRoomSchema);
module.exports = ChatRoom;