const {getUser} = require('../services/auth') 


async function checkUser(req,res,next) {
    const userId = req.cookies?.uid;
    console.log(userId);
    if(!userId){
        console.log("User not found");
        return next();
    }
    const user = await getUser(userId);
    if(!user) {
        return next();
    }
    req.user = user;
    next();
    
}

const checkAdmin = async (req,res,next) =>{
    const user = req.user;
    if(!req.user){
        console.log("value of req.user->",req.user);
        return res.status(401).json({message:"login first ",success:"false"});
      }
    console.log(user);
    if(user.role === "ADMIN"){
        next();
    }
    else return res.status(404).json({message:"user is not admin",success:false,user:user.role});
}
module.exports = {checkUser,checkAdmin};