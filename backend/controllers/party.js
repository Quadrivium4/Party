const { getPartiesInGivenArea } = require("../functions/party");
const ChatRoom = require("../models/chatRoom");
const Party = require("../models/party");
const User = require("../models/user");
const { onPartyExpires } = require("../utils/cronJobs");
const { saveFile } = require("../utils/files");

const postParty = async(req, res) =>{
    console.log(req.body, req.files);
    if(!req.user.paypalBusinessId) throw new AppError(1, 403, "You must have a paypal Business account linked")
    const {name, description, location, price, x, y, capacity, date, purchaseDeadline, imagesAspectRatio } = req.body;
    const promises = [];
    if(req.files){
        console.log("hello", req.files)
        if(!Array.isArray(req.files.images) && typeof req.files.images === "object") promises.push(saveFile(req.files.images));
        if(Array.isArray(req.files.images)){
            req.files.images.forEach((image, i) => {
                promises.push(saveFile(image));
            })
        }
    }
    const imagesObjectIds = await Promise.all(promises);
    const images = imagesObjectIds.map((imageId, i)=> {
        return { 
            id: imageId,
            aspectRatio: imagesAspectRatio[i]
        }
    })
    console.log({images})
    
    let party = await Party.create({
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
    onPartyExpires(party);
    const chatRoom = await ChatRoom.create({party: party.id, people: [party.owner], messages: [], admin: party.owner});
    party = await Party.findByIdAndUpdate(party.id, {
        chat: chatRoom.id
    })
    const user = await User.findByIdAndUpdate(req.user.id, {$push: {parties: party.id}});
    res.send(party);
}
const getMyParties = async (req, res) => {
    const user = req.user;
    console.log(user)
    const parties = await Party.find({_id: {$in: user.parties}});
    console.log({parties})
    res.send(parties)
}
const getNearParties = async(req, res) => {
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
    getNearParties,
    getMyParties,
    getParty
}