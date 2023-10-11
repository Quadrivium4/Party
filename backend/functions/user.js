require("dotenv").config();
const jwt = require("jsonwebtoken");

const crypto = require("crypto");
const {validateEmail, hashPassword, comparePassword, createTokens} = require("../utils");
const User = require("../models/user");
const UnverifiedUser = require("../models/unverifiedUser");


const createOrLoginUserFromGoogle = async(accessToken) =>{
    const googleUser = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    }).then(res => res.json());
    if (googleUser.error) throw new AppError(1, 401, googleUser.error.message);
    console.log({googleUser})
    let user = await User.findOne({
        email: googleUser.email
    });
    if (!user) {
        user = await User.create({
        name: googleUser.given_name,
        email: googleUser.email
    });
}
    const { aToken } = createTokens(user.id, user.email);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...user.tokens, aToken]
        }, { new: true });
    console.log({user, aToken})
    return { user, aToken };
}

const createUser = async(name, email, password) =>{
    let user = await User.create({
        name,
        email,
        password
    });
    const {aToken} = createTokens(user.id, email);
    user = await User.findByIdAndUpdate(user.id, 
        { 
            tokens: [...user.tokens, aToken ]
        }, {new: true});

    return {user, aToken };
}
const createUnverifiedUser = async (name, email, password) => {
    name = name.trim();
    email = email.trim();
    password = password.trim();
    if (!name || !email || !password) throw new AppError(1, 401, "Invalid Credentials");
    if (!validateEmail(email)) throw new AppError(1, 401, "Invalid Email");
    if (password.length < 6 || password.length > 50) throw new AppError(1, 401, "Password must be more than 6 characters long");
    const hashedPassword = await hashPassword(password);
    
    let user = await UnverifiedUser.create({
        name,
        email,
        password: hashedPassword,
        token: crypto.randomBytes(32).toString("hex")
    });
    
    return user
}
const findUser = async (email, password) => {
    email = email.trim();
    password = password.trim();
    if (!email || !password) throw new AppError(1, 401, "Invalid Credentials");
    if (!validateEmail(email)) throw new AppError(1, 401, "Invalid Email");
    let user = await User.findOne({email});
    if(!user) throw new AppError(1, 401, "No user with that email found");
    if(!await comparePassword(password, user.password)) throw new AppError(1, 401, "Incorrect Password");
    
    const { aToken } = createTokens(user.id, email);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...user.tokens, aToken]
        }, { new: true });
    return {aToken, user};
}
const verifyUser = async(id, token) =>{
    const unverifiedUser = await UnverifiedUser.findOneAndDelete({_id: id, token});
    console.log(unverifiedUser)
    if (!unverifiedUser) throw new AppError(1, 401, "Cannot Verify User");
    return unverifiedUser;
}
const deleteUser = async(id) =>{
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser
}
const logoutUser = async(user, token) =>{
    const newTokens = user.tokens.filter(tk=> tk.token !== token);
    user = await User.findByIdAndUpdate(user.id,
        {
            tokens: [...newTokens]
        }, { new: true });
    return user;
}
module.exports = {
    createUser,
    createUnverifiedUser,
    findUser,
    logoutUser,
    verifyUser,
    deleteUser,
    createOrLoginUserFromGoogle
}