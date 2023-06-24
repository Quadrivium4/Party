const { getPartiesInGivenArea } = require("../functions/party");
const Party = require("../models/party")

const postParty = async(req, res) =>{
    const {name, description, location, price, coords } = req.body;
    const party = await Party.create({
        name,
        description,
        location,
        price,
        coords,
        owner: req.user.id,
    })
    res.send(party);
}
const getParties = async(req, res) => {
    console.log("getting parties...")
    const { latitude, longitude, radius } = req.query;
    console.log(req.query)
    console.log({latitude, longitude, radius})
    const parties = await getPartiesInGivenArea({x: +longitude, y: +latitude}, +radius);
    console.log({parties})
    res.send(parties);
}
const getParty = async(req, res) => {
    const { id} = req.params;
    const party = await Party.findById(id);
    res.send(party);
}
module.exports = {
    postParty,
    getParties,
    getParty
}