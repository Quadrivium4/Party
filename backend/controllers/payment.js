require("dotenv").config();
const Party = require("../models/party");
const PaypalOrder = require("../models/paypalOrder");
const User = require("../models/user");
const { createOrder, createPartner, generateClientToken, capturePayment } = require("../utils/paypal");
const sendMail = require("../utils/sendMail");
const { API_URL, CLIENT_URL } = process.env;

const checkoutPage = async (req, res) => {
    const customer = req.user;
    const clientToken = await generateClientToken();
    const { id } = req.params;
    const party = await Party.findById(id);
    const owner = await User.findById(party.owner);
    if (party.people.length >= party.capacity) return res.send(`<script>window.ReactNativeWebView.postMessage(JSON.stringify({error: "party is full"}));</script>`)
    console.log({ party, customer, clientToken, owner })
    res.render("checkout", {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientToken,
        party: party,
        owner: owner,
        customer: customer,
    })
}
const checkoutPageTest = async (req, res) => {
    const customer = await User.findById("64b5337b1fc6c0c1194b3281");
    const clientToken = await generateClientToken();
    const party = await Party.findById("6491ca173fecbcfe717455c2");
    const owner = await User.findById(party.owner);
    console.log(party)
    res.render("checkout2", {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientToken,
        party: party,
        owner: owner,
        customer: customer,
    })
}
const getOnboardingLink = async (req, res) => {
    const { id } = req.user;
    const link = await createPartner(id);
    res.send({ link });
}
const completeOnboarding = async (req, res) => {
    console.log(req.query)
    const { merchantId, merchantIdInPayPal } = req.query;
    const user = await User.findByIdAndUpdate(merchantId, { paypalBusinessId: merchantIdInPayPal }, { new: true })
    console.log(user)
    res.redirect(process.env.CLIENT_URL + `/tab-navigator/create-party/${merchantIdInPayPal}`)
}
const buy = async (req, res) => {
    console.log("getted", req.body)
    const { partyId, customerId } = req.body;
    const party = await Party.findById(partyId);
    if (party.people.length >= party.capacity) throw new AppError(1, 403, "Party is already full");
    const owner = await User.findById(party.owner);
    const customer = await User.findById(customerId);
    const paypalPayment = await PaypalOrder.create({ sellerId: owner.id, amount: party.price, customerId: customer.id, partyId });
    const result = await createOrder(party.price, owner.paypalBusinessId, paypalPayment.id);
    await PaypalOrder.findByIdAndUpdate(paypalPayment.id, { orderId: result.id });
    console.log(result)
    res.send({ ...result, customId: paypalPayment.id });
}
const sendEmailPaymentConfirmation = async (req, res) => {
    const { id } = req.params;
    const paypalOrder = await PaypalOrder.findById(id);
    console.log({paypalOrder})
    const customer = await User.findById(paypalOrder.customerId);
    await sendMail({to: customer.email, subject: "confirm payment", body: `<h1>Confirm your payment!!:</h1> <a href="${API_URL}/capture/${paypalOrder.id}">confirm</a>`});
    res.send({ msg: "We sent you an email to confirm the payment!" });
}
const confirmPayment = async (req, res) => {
    console.log("captured", req.params)

    const { id } = req.params;
    const paypalOrder = await PaypalOrder.findByIdAndDelete(id);
    let party = await Party.findById(paypalOrder.partyId);
    if (party.people.length >= party.capacity) return res.redirect(CLIENT_URL + "/failure/1");
    party = await Party.findByIdAndUpdate(party.id, { $push: { people: paypalOrder.customerId } })
    let customer = await User.findByIdAndUpdate(paypalOrder.customerId, { $push: { tickets: paypalOrder.partyId } });
    let data = await capturePayment(paypalOrder.orderId);

    console.log(data)
    res.redirect(CLIENT_URL + "/tab-navigator/tickets/reload");
}
module.exports = {
    buy,
    confirmPayment,
    sendEmailPaymentConfirmation,
    getOnboardingLink,
    completeOnboarding,
    checkoutPage,
    checkoutPageTest
}