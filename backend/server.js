require("dotenv").config();
require("./globals");
const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const app = express();
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


app.use(express.json());
app.use(fileUpload());
app.set('view engine', 'ejs');

app.use(publicRouter);
app.use("/protected", protectedRouter);

app.listen(port,"172.20.10.2", async()=>{
    try {

        await connectDB(process.env.MONGO_URI);
        //createPdfList("6491c9853fecbcfe717455bc")
        //await mongoose.files.delete(ObjectId("64bd2ab2efb8035c6638abcf"));
        console.log(`Server listening on port ${port}`);
        // To do: uncomment the line below
        //setCronJobs();
    } catch (err) {
        console.log("Cannot start Server:", err);
    }
    
})

app.use(errorHandler);