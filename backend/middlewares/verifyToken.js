require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { extractBearerToken } = require("../utils");

const verifyToken = async(req, res, next) =>{
    const token = extractBearerToken(req);
    if(!token) throw new AppError(1, 403, "Invalid Token");
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