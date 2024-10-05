const {getUser} = require('../services/auth') 


async function checkUser(req,res,next) {
    const userId = req.cookies?.uid;
    // console.log(userId);
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
module.exports = {checkUser}