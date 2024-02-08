// Load env variables
if(process.env.NODE_ENV != "production"){
    require("dotenv").config({path:"../.env"});
}

const jwt = require("jsonwebtoken");

// Loading Secret String From ENV File For JWT
const jwt_secret = process.env.JWT_SECRET || "SecretKey";
const fetchuser = async (req,res,next) => {
    const token = req.header("auth-token");
    if(!token){
        res.status(401).send("Enter Valid Token");
    }
    try{
        const data = jwt.verify(token,jwt_secret);
        req.user = data.User;
        next();
    }catch (err){
        console.log(err);
            return res.status(500).send("Internal Server Error!")        
        }

}

module.exports = fetchuser;