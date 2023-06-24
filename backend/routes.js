const express = require("express");
const { register, login, logout, getUser, verify, deleteAccount } = require("./controllers/user");
const { tryCatch } = require("./utils");
const verifyToken = require("./middlewares/verifyToken");
const { getParties, postParty } = require("./controllers/party");

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

protectedRouter.get("/logout", tryCatch(logout));
protectedRouter.route("/party")
    .get(tryCatch(getParties))
    .post(tryCatch(postParty))

protectedRouter.route("/user")
    .get(tryCatch(getUser))
    .delete(tryCatch(deleteAccount))
module.exports = {
    publicRouter,
    protectedRouter
}