require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = async(req, res, next) =>{
    if(!req.headers.authorization) throw new AppError(1, 403, "Invalid Token");
    if (!req.headers.authorization.startsWith("Bearer ")) throw new AppError(1, 403, "Invalid Token");
    console.log(req.headers.authorization)
    const token = req.headers.authorization.split(" ")[1];
    console.log({token})
    const {id, email} = jwt.verify(token, process.env.JWT_A_TOKEN_KEY);
    console.log({id, email});
    const user = await User.findById(id);
    if (!user) throw new AppError(1, 403, "Invalid Token");
    req.user = user;
    req.token = token;
    next();
}
module.exports = verifyToken;