const {User} = require('../models/user');


async function handleGetProfile(req,res) {
    const user = req.user;

    console.log(user);
    if(!user){
        return res.status(401).json({message:"Unauthorized"});
    }

    try {
        return res.status(200).json({
            fullName:user.fullName,
            email:user.email,
            role:user.role
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Something went wrong"});
        
    }
}

module.exports = {handleGetProfile}