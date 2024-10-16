const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        required : true,
        default : "USER"
    },
    phone : {
        type : String
    },
    address : {
        type : String
    },
    resetPasswordOtp:{
        type:Number,
      },
      resetPasswordOtpExpires:{
        type:Number,
      },
},{timestamps : true})

const User = mongoose.model('User',userSchema);

module.exports = {User};