const Party = require("../models/party");
const { distanceBetweenEarthPoints } = require("../utils");




const getPartiesInGivenArea =  async(point, radius) =>{
    const parties = await Party.find({});
    const filteredParties = parties.filter(party=>{
        let distance = distanceBetweenEarthPoints(point, party.coords);
        console.log({
            distance,
            coords: party.coords,
            point,
            from: party.location
        })
        return distance < radius
    });
    return filteredParties;
}
module.exports = {
    getPartiesInGivenArea
}