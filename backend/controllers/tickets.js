const sendMail = require("../utils/sendMail");
const { createOrder, capturePayment } = require("./utils/paypal");



const order = async(req, res) =>{
    const {link, id, token} =  await createOrder();
    res.send({link, id, token});
}
const requestConfirmation = async(req, res) =>{
    await sendMail()
}
const buy = async(req, res)




module.exports = {
    order
}