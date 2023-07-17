require("dotenv").config();
require("./globals");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const connectDB = require("./db");


const {publicRouter, protectedRouter} = require("./routes");
const errorHandler = require("./middlewares/errorHandler");
const { generateClientToken } = require("./utils/paypal");
const Party = require("./models/party");


app.use(express.json());
app.set('view engine', 'ejs');
app.get("/checkout/:id", async(req, res)=>{
    const clientToken = await generateClientToken();
    const {id} = req.params;
    const party = await Party.findById(id);
    res.render("checkout", {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientToken,
        party
    })
})
app.use(publicRouter);
app.use("/protected", protectedRouter);

app.listen(port,"172.20.10.2", async()=>{
    try {
        await connectDB(process.env.MONGO_URI);
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        console.log("Cannot start Server:", err);
    }
    
})

app.use(errorHandler);