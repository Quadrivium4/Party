const Party = require("../models/party");
const User = require("../models/user");
const { distanceBetweenEarthPoints } = require("../utils");
const { deleteFile } = require("../utils/files");



const deletePartyImages = async(images) =>{
    const promises = [];
    images.forEach(imageId=>{
        promises.push(deleteFile(imageId));
    })
    await Promise.all(promises);
}
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
    getPartiesInGivenArea,
    deletePartyImages
}