// Load env variables
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

// Import Dependencies
const mongoose = require("mongoose")


async function connectToDb(){
    try{
        await mongoose.connect(process.env.DB_URL || 10000)
        // console.log("Connected to DB")
    } catch (err){
        console.log(err)
    }
}


module.exports = connectToDb;