require("dotenv").config();
require("./globals");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const connectDB = require("./db");


const {publicRouter, protectedRouter} = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const sendMail = require("./utils/sendMail");

app.use(express.json());

app.use(publicRouter);
app.use("/protected", protectedRouter);

app.listen(port,"172.20.10.2", async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log(`Server listening on port ${port}`);
        sendMail("<h1>Hello</h1>", "miguelgiacobbe@gmail.com", "you are stupid")
    } catch (err) {
        console.log("Cannot start Server:", err);
    }
    
})

app.use(errorHandler);