const mongoose = require("mongoose");
const PaypalOrderSchema = new mongoose.Schema({
    sellerId: String,
    customerId: String,
    amount: Number,
    orderId: String,
    partyId: String
})
const PaypalOrder = mongoose.model("PaypalOrder", PaypalOrderSchema);
module.exports = PaypalOrder;