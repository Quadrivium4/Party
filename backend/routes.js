const express = require("express");
const { register, login, logout, getUser, verify, deleteAccount } = require("./controllers/user");
const { tryCatch } = require("./utils");
const verifyToken = require("./middlewares/verifyToken");
const { getParties, postParty, getParty } = require("./controllers/party");
const { createOrder, capturePayment } = require("./utils/paypal");

const publicRouter = express.Router();
const protectedRouter = express.Router();

protectedRouter.use(tryCatch(verifyToken));

publicRouter.route("/parties")
    .get((req, res)=>{
        res.send({party: 1, name: "Super party"})
    })
publicRouter.post("/login", tryCatch(login))
publicRouter.post("/register", tryCatch(register));
publicRouter.post("/verify", tryCatch(verify))


publicRouter.get("/buy/:id", tryCatch(async(req, res)=>{
    console.log("getted", req.params)
    const {token, link, id} = await createOrder();
    console.log({token, link, id})
    res.send({token, link, id});
}))
publicRouter.get("/confirm-email/:id",)
publicRouter.get("/capture/:id", tryCatch(async (req, res) => {
    console.log("captured", req.params)

    const {id } = req.params;
    let data = await capturePayment(id)
    console.log(data)
    res.send(data);
}))
protectedRouter.get("/logout", tryCatch(logout));
protectedRouter.route("/party")
    .get(tryCatch(getParties))
    .post(tryCatch(postParty))
protectedRouter.route("/party/:id")
    .get(tryCatch(getParty))

protectedRouter.route("/user")
    .get(tryCatch(getUser))
    .delete(tryCatch(deleteAccount))
module.exports = {
    publicRouter,
    protectedRouter
}