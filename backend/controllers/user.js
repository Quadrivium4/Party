require("dotenv").config();

const { createUser, findUser, logoutUser, createUnverifiedUser, verifyUser, deleteUser, createOrLoginUserFromGoogle} = require("../functions/user");
const User = require("../models/user");
const { extractBearerToken } = require("../utils");
const sendMail = require("../utils/sendMail");

const register = async(req, res) =>{
    const { name, email, password } = req.body;
    const user = await createUnverifiedUser(name, email, password);
    const link = `${process.env.CLIENT_URL}/verify/${user.id}/${user.token}`;
    console.log({link})
    await sendMail({
        to: user.email,
        subject: "Confirm your email",
        body:  `<h1>Confirmation email: </h1>
                <a href="${link}">verify</a>`
    })
    res.send(user);
}
const googleLogin = async(req, res) =>{
    res.render("googleLogin", {
    })
}
const signInWithGoogle = async (req, res) => {
    console.log("logging with google...")
    const token = extractBearerToken(req);
    if (!token) throw new AppError(1, 403, "Invalid Token");
    const { user, aToken } = await createOrLoginUserFromGoogle(token);
    console.log({user, aToken})
    res.send({user, aToken});
}
const verify = async (req, res) => {
    console.log(req.body)
    const {id,  token } = req.body;
    const {name, email, password}= await verifyUser(id, token);
    console.log({name, email, password})
    const { user, aToken } = await createUser(name, email, password);

    res.send({ user, aToken });
}
const login = async(req, res) =>{
    const {email, password} = req.body;
    const {user, aToken} = await findUser(email, password);
    
    res.send({ user, aToken });
}
const getUser = async(req, res) =>{
    const {id} = req.params;
    if(!id) return res.send(req.user);
    const user = await User.findById(id);
    return res.send(user)
}
const deleteAccount = async(req, res) =>{
    const deletedUser = await deleteUser(req.user.id);
    console.log("Deleted User", deletedUser.name);
}
const logout = async(req, res) =>{
    console.log("logging out");
    const user = await logoutUser(req.user, req.token);
    res.send({msg: "Successfully logged out!"});
}
module.exports = {
    register,
    login,
    logout,
    getUser,
    verify,
    deleteAccount,
    googleLogin,
    signInWithGoogle
}