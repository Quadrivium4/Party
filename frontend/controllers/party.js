import { baseUrl, protectedUrl } from "../constants"
import { protectedCrossing } from "../utils"

const getParty = async(id) =>{
    return await protectedCrossing(protectedUrl + "/party/" +id);
}
const getParties = async(longitude, latitude, radius) => {
    console.log("fetching")
    return await protectedCrossing(protectedUrl + `/party?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
}
const postParty = async(body = {name: "new party", descrption: "Wow party", location: "Milan", price: 0, coords: {x: 0, y: 0}, capacity: 0}) =>{
    return await protectedCrossing(protectedUrl + "/party", "POST", body, { "Content-Type": 'multipart/form-data'});
}

export {
    postParty,
    getParties,
    getParty
}