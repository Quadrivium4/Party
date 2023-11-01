import { baseUrl, protectedUrl } from "../constants"
import { protectedCrossing } from "../utils"

const getMyParties = async() =>{
    return await protectedCrossing(protectedUrl + "/party");
}
const getParty = async(id) =>{
    return await protectedCrossing(protectedUrl + "/party/" +id);
}
const getNearParties = async(longitude, latitude, radius) => {
    console.log("fetching")
    return await protectedCrossing(protectedUrl + `/near-parties?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
}
const postParty = async(body) =>{
    return await protectedCrossing(protectedUrl + "/party", "POST", body, { "Content-Type": 'multipart/form-data'});
}

export {
    postParty,
    getNearParties,
    getMyParties,
    getParty
}