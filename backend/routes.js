const express = require("express");
const { register, login, logout, getUser, verify, deleteAccount, googleLogin, signInWithGoogle} = require("./controllers/user");
const { tryCatch } = require("./utils");
const verifyToken = require("./middlewares/verifyToken");
const {  postParty, getParty, getNearParties, getMyParties } = require("./controllers/party");
const { createOrder, capturePayment } = require("./utils/paypal");
const { buy, completeOnboarding, getOnboardingLink, confirmPayment, sendEmailPaymentConfirmation, checkoutPage, checkoutPageTest, cancelOrder, refundAll } = require("./controllers/payment");
const { getTickets } = require("./controllers/tickets");
const { downloadFile } = require("./utils/files");

const publicRouter = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(tryCatch(verifyToken));


publicRouter.route("/parties")
    .get((req, res)=>{
        res.send({party: 1, name: "Super party"})
    })
publicRouter.get("/google-login", tryCatch(googleLogin))
publicRouter.post("/google-login", tryCatch(signInWithGoogle))
publicRouter.post("/login", tryCatch(login))
publicRouter.post("/register", tryCatch(register));
publicRouter.post("/verify", tryCatch(verify))


publicRouter.get("/file/:id", tryCatch(downloadFile))
publicRouter.post("/buy", tryCatch(buy))
publicRouter.delete("/cancel-order/:id", tryCatch(cancelOrder))
publicRouter.get("/confirm-email/:id", tryCatch(sendEmailPaymentConfirmation))
publicRouter.get("/capture/:id", tryCatch(confirmPayment))
publicRouter.get("/complete-onboarding-paypal", tryCatch(completeOnboarding))
protectedRouter.get("/paypal-onboarding-link", tryCatch(getOnboardingLink));
protectedRouter.get("/checkout/:id", tryCatch(checkoutPage));
//publicRouter.get("/checkout", tryCatch(checkoutPageTest))

protectedRouter.get("/refund", tryCatch(refundAll))


protectedRouter.get("/logout", tryCatch(logout));
protectedRouter.get("/near-parties", tryCatch(getNearParties))
protectedRouter.route("/party")
    .get(tryCatch(getMyParties))
    .post(tryCatch(postParty))
protectedRouter.route("/party/:id")
    .get(tryCatch(getParty))

protectedRouter.route("/user/:id?")
    .get(tryCatch(getUser))
    .delete(tryCatch(deleteAccount))

protectedRouter.route("/tickets")
    .get(tryCatch(getTickets))
module.exports = {
    publicRouter,
    protectedRouter
}