require("dotenv").config();
require("./globals");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
const helmet = require("helmet");
const port = 5000;

const connectDB = require("./db");


const {publicRouter, protectedRouter} = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { generateClientToken } = require("./utils/paypal");
const Party = require("./models/party");
const User = require("./models/user");
const mongoose = require("mongoose");
const { setCronJobs } = require("./utils/cronJobs");
const { createPdfList } = require("./utils/createPdf");
const {ObjectId} = require("mongodb")

const http = require("http");
const {Server} = require("socket.io");
const ChatRoom = require("./models/chatRoom");
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket)=>{
    console.log("user connected");
    socket.on("joinRoom", async(roomId)=>{
        console.log("joining room: ", roomId)
        const room = await ChatRoom.findById(roomId);
        socket.join(roomId);
        console.log({ room, socketRooms: socket.rooms })
        io.to(roomId).emit("joinedRoom", room.messages);
    })
    socket.on("message", async({room, message}) => {
        console.log({room, message})
        socket.to(room).emit("message", message);
        await ChatRoom.findByIdAndUpdate(room, {
            $push: {
                messages: message
            }
        })
        
    })
    /*socket.on("message", (msg)=>{
        socket.to()
        console.log(msg)
        io.emit("message", msg);
    })*/
    socket.on("disconnect", ()=>{
        console.log("user disconnected")
    })
})


app.use(express.json());
app.use(fileUpload());
app.set('view engine', 'ejs');

app.use(publicRouter);
app.use("/protected", protectedRouter);

server.listen(port,"172.20.10.2", async()=>{
    try {

        await connectDB(process.env.MONGO_URI);
        //createPdfList("6491c9853fecbcfe717455bc")
        //await mongoose.files.delete(ObjectId("64bd2ab2efb8035c6638abcf"));
        console.log(`Server listening on port ${port}`);
        /*const parties = await Party.find({});
        for(let i = 0; i< parties.length; i++){
            let party = parties[i];
            if (!party.images[0]?.aspectRatio){
                let newImagesArray = party.images.map(id => {
                    return {
                        id: id,
                        aspectRatio: 1
                    }
                })
                console.log(newImagesArray)
                await Party.findByIdAndUpdate(party.id, {images: newImagesArray})
            }
            
        }*/
        /*const chats = await ChatRoom.find({});
        for(let i = 0; i< chats.length; i++){
            let chat = chats[i];
            let party = await Party.findByIdAndUpdate(chat.party,{
                chat: chat.id},{new: true})
                console.log(party)
        }*/
        // To do: uncomment the line below
        setCronJobs();
    } catch (err) {
        console.log("Cannot start Server:", err);
    }
    
})

app.use(errorHandler);