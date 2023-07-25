const { getPartiesInGivenArea } = require("../functions/party");
const Party = require("../models/party");
const User = require("../models/user");
const { onPartyExpires } = require("../utils/cronJobs");
const { saveFile } = require("../utils/files");

const postParty = async(req, res) =>{
    console.log(req.body, req.files)
    const {name, description, location, price, x, y, capacity, date, purchaseDeadline } = req.body;
    const promises = [];
    if(req.files){
        console.log("hello", req.files)
        for (const [key, value] of Object.entries(req.files)) {
            console.log({key, value});
            promises.push(saveFile(value));
        }
    }
    const images = await Promise.all(promises);
    console.log({images})
    
    const party = await Party.create({
        name,
        description,
        location,
        price,
        capacity,
        expireAfterSeconds: date,
        date,
        purchaseDeadline,
        coords: {x, y},
        images,
        owner: req.user.id
    })
    onPartyExpires(party.id);
    res.send(party);
}
const getParties = async(req, res) => {
    console.log("getting parties...")
    const { latitude, longitude, radius } = req.query;
    console.log(req.query)
    //console.log({latitude, longitude, radius})
    const parties = await getPartiesInGivenArea({x: +longitude, y: +latitude}, +radius);
    //console.log({parties})
    const promises = [];
    const final = [

    ]
    for (let i = 0; i < parties.length; i++) {
        const party = parties[i];
        promises.push(User.findById(party.owner));
    }
    const owners = await Promise.all(promises);
    for (let i = 0; i < parties.length; i++) {
        const party = parties[i];
        const owner = owners[i];
        party.owner = owner;
        final.push({...party.toObject(), owner})
    }
    //console.log(final)
    res.send(final);
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