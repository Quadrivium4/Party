require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
    const expression = /([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|"([]!#-[^-~ \t]|(\\[\t -~]))+")@([-!#-'*+/-9=?A-Z^-~]+(\.[-!#-'*+/-9=?A-Z^-~]+)*|\[[\t -Z^-~]*])/i;
    return expression.test(String(email).toLowerCase());
}
const tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);
    } catch (error) {
        console.log("error in try catch")
        return next(error)
    }
}
const hashPassword = (password) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.hash(password, 10, (err, hash)=>{
            if (err) reject(err);
            resolve(hash);
        })
    })
}
const comparePassword = (password, hashedPassword) =>{
    return new Promise((resolve, reject)=>{
        bcrypt.compare(password, hashedPassword, (err, result)=>{
            if(err) reject(err);
            resolve(result);
        })
    })
}
const createTokens = (id, email)=>{
    const aToken = jwt.sign({ email, id}, process.env.JWT_A_TOKEN_KEY);
    const rToken = jwt.sign({ email, id}, process.env.JWT_R_TOKEN_KEY);
    return {aToken, rToken}
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

const distanceBetweenEarthPoints = (point1, point2) =>{
    return getDistanceFromLatLonInKm(point1.y, point1.x, point2.y, point2.x)
}
function extractBearerToken(req){
    if (!req.headers.authorization) return false
    if (!req.headers.authorization.startsWith("Bearer ")) return false;
    const token = req.headers.authorization.split(" ")[1];
    return token;
}
module.exports = {
    validateEmail,
    tryCatch,
    hashPassword,
    comparePassword,
    createTokens,
    distanceBetweenEarthPoints,
    extractBearerToken
}