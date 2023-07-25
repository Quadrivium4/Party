import { baseUrl, protectedUrl } from "../constants"
import { protectedCrossing, crossing } from "../utils"

const getTickets = async () => {
    return await protectedCrossing(protectedUrl + "/tickets");
}
const getParties = async (longitude, latitude, radius) => {
    console.log("fetching")
    return await protectedCrossing(protectedUrl + `/party?latitude=${latitude}&longitude=${longitude}&radius=${radius}`);
}
const postParty = async (body = { name: "new party", descrption: "Wow party", location: "Milan", price: 0, coords: { x: 0, y: 0 } }) => {
    return await protectedCrossing(protectedUrl + "/party", "POST", body);
}

export {
    getTickets
}