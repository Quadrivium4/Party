const Party = require("../models/party");
const sendMail = require("../utils/sendMail");
const { createOrder, capturePayment } = require("../utils/paypal");



const getTickets = async(req, res) =>{
    console.log("requesting tickets..")
    const user = req.user;
    const tickets = await Party.find({_id: {$in: user.tickets}});
    res.send(tickets);
}




module.exports = {
    getTickets
}