const {User} = require('../models/user');
const {setUser} = require('../services/auth');

async function handleSignUp(req,res) {

    const {fullName,email,password} = req.body;

    try {
        await User.create({
            fullName,
            email,
            password
        })
        return res.status(200).json({message:"User created successfully"});
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong"});
    }
}

async function handleSignIn(req,res) {
    const {email,password} = req.body;
    console.log(email,password);
    try {
        const user = await User.findOne({email,password});
        if(user) {
            const token  = setUser(user);
            res.cookie("uid",token);
            return res.status(200).json({message:"Login successful",jwtToken:token});
        }
        else {
            return res.status(401).json({message:"Invalid credentials"});
        }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({message:"Something went wrong",error:err});
    }

}





module.exports = {handleSignUp,handleSignIn}