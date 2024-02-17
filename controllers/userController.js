// Load env variables
// if(process.env.NODE_ENV != "production"){
//     require("dotenv").config({path:"../.env"});
// }

// Import Dependencies
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const {body, validationResult} = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");


// Loading Secret String From ENV File For JWT
const jwt_secret = process.env.JWT_SECRET || "SecretKey";

// ROUTE 1 : Signin User endPoint /auth/signin,  No Login Required.
router.post("/signin",[
    // Validation
    body("username","Minimum Length for Username will be 5 char.").isLength({ min: 5 }),
    body("password","Minimum Length for Password Will be 8 char.").isLength({ min: 8})
], async (req,res) => {
    try{
        
        // sending bad response for error
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.json({error:"Enter Valid Values Min 5char required for Username and 8char for password*",type:"danger"});
        }
        
        // get Data and Create an Secure Password using Bcrypt Js.
        const salt = await bcrypt.genSalt(10);
        const securePass = await bcrypt.hash(req.body.password,salt); 
        
        const username = req.body.username;
        const password = securePass;


        // Save Data else show error
        const user =  await User.create({
            username : username,
            password: password
        }).catch(err => res.json({error: "Duplicate Name Found Enter Again.",type:"danger"})); // When Unique Values is Required this is to show error when duplicate value found.

        const data = {
            User: {
                id: user._id
            }
        }
        const authToken = jwt.sign(data,jwt_secret);


        return res.json({authToken:authToken,type:"success"});
        
    }catch (err){
        return res.status(500).json({error:"Internal Server Error!"})        
    }
});


// ROUTE 2 : Login User endPoint /auth/login,  No Login Required.
router.post("/login",[
    body("username","Minimum Length for Username will be 5 char.").isLength( {min : 5} ),
    body("password","please enter password").exists()
], async (req,res) => {
    try{
        // if fields are not correct, send bad response
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.json({error:"Enter Valid Values Min 5char required for Username and 8char for password*",type:"danger"});
        }

        // get user input
        const username = req.body.username;
        const password = req.body.password;

        // Finding User With Their Username if not found show bad response.
        const user = await User.findOne({username:username});

        if(!user){
            return res.json({error: "No user Found!",type:"danger"});
        }

        // if user found then compare entered passwords from hash password.else show bad response.
        const passwordCompare = await bcrypt.compare(password,user.password);

        if(!passwordCompare){
            return res.json({error:"Enter Correct Values.",type:"danger"});
        }

        const data = {
            User: {
                id: user._id
            }
        }
        const authToken = jwt.sign(data,jwt_secret);

        return res.json({authToken:authToken,type:"success"});
    }catch{
        return res.status(500).send("Internal Server Error!")
    }

});


// ROUTE 3 : Get User Details endPoint auth/getuser, Login Required
router.post("/getuser",fetchuser, async (req,res) => {

    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select("-password");
        res.json(user);        
        
    } catch (err){
        // console.log(err);
        return res.status(500).send("Internal Server Error!")        
    }

});

module.exports = router;