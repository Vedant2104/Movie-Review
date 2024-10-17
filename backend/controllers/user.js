const {User} = require('../models/user');
const {setUser} = require('../services/auth');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const saltRounds = 10;
async function handleSignUp(req,res) {

    const {fullName,email,password} = req.body;

    try {
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        await User.create({
            fullName:fullName,
            email:email,
            password:hash,
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
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({message:"enter the valid email",success:false});
        }
        const isMatched = await bcrypt.compare(password,user.password);
        if(!isMatched){
            return res.status(404).json({message:"Wrong Password"});
        }
        // if(user) {
            const token  = setUser(user);
            res.cookie("uid",token);
            return res.status(200).json({message:"Login successful",jwtToken:token,user:user});
        // }
        // else {
        //     return res.status(401).json({message:"Invalid credentials"});
        // }
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({message:"Something went wrong",error:err});
    }

}
const  handleLogout = async(req,res) =>{
   return res.status(200).json({success:"true"}).clearCookie('uid');
}

const handleForgotPassword = async (req,res) =>{
    const { email } = req.body;

  try {
      //Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      //Generate a random OTP (6-digit number)
      const otp = Math.floor(100000 + Math.random() * 900000); // Generates a random 6-digit number

      //Set the OTP expiration time (e.g., 10 minutes)
      const expiration = Date.now() + 10 * 60 * 1000;

      // Save OTP and expiration in user model
      user.resetPasswordOtp = otp;
      user.resetPasswordOtpExpires = expiration;
      await user.save();

      //Send the OTP via email
      const transporter = nodemailer.createTransport({
          service: 'gmail', // You can use other services too
          host:"smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
              user: 'sikarwarrr315@gmail.com',
              pass: 'xntb zjgy ocym jaqa',
          },
          connectionTimeout:10000,
      });

      const mailOptions = {
          from:{
              name:"Moview Review",
              address:"sikarwarrr315@gmail.com"
            },
          to: user.email,
          subject: 'Password Reset OTP',
          text: `You have requested a password reset. Your OTP code is: ${otp}. This code will expire in 10 minutes.`,
      };
      const sed = await transporter.sendMail(mailOptions);
      console.log(sed)

      res.status(200).json({ message: 'OTP has been sent to your email' });
  } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
  }
}

const handleResetPassword = async (req,res)=>{
    console.log("from reset-password...");
    const { email, otp, newPassword } = req.body;
  try {
      //Find the user by email and verify OTP and expiration time
      const user = await User.findOne({
          email: email,
          resetPasswordOtp: otp,
        //   resetPasswordOtpExpires: { $gt: Date.now() } // Ensure the OTP has not expired
      });
      console.log(user);
      if (!user) {
          return res.status(400).json({ message: 'Invalid or expired OTP' });
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(newPassword, salt);
      //Update the user's password (make sure to hash it if using plain-text)
      user.password = hash; // Assuming hashing is handled in the model
      user.resetPasswordOtp = undefined; // Clear OTP
      user.resetPasswordOtpExpires = undefined; // Clear expiration time
      console.log(user,"ram ram");
      await user.save();

      res.status(200).clearCookie('uid').json({ message: 'Password has been successfully reset and logout' });
  } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
  }
}

const handleChangeRole = async(req,res) => {
    console.log(req.user);
    const {id,role} = req.body;
    if(!req.user){
        return res.status(404).json({message:"login first...",success:true});
    }
    if(req.user.role !== "ADMIN"){
        return res.status(404).json({message:"user is not admin",success:false});
    }
    const user = await User.findById(id);
    if(!user){
        return res.status(404).json({message:"user not found",success:false});
    }
    user.role = role;
    await user.save();
    return res.status(200).json({message:"role changed success fully",success:true});
}


module.exports = {handleSignUp,handleSignIn,handleLogout,handleForgotPassword,handleResetPassword,handleChangeRole}