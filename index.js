// Load env variables
if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}


// import dependenceis
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connect");
const employeController = require("./controllers/employeController");
const userControlller = require("./controllers/userController");

// connecting to database
connectToDb();


// Create an express app
const app = express();

// Configuring Express
app.use(express.json());
app.use(cors());

// Routing
    // Signin, Login User.
app.use("/auth", userControlller);
    // Get,Update, Delete,Add Data From Database for specific user
app.use("/data",employeController);


// Start our server
app.listen(process.env.PORT)