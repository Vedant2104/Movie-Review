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
    phone:{
        type:Number,
        default:0
    },
    address:{
        type:String,
        default:"iiita"
    }
},{timestamps : true})

const User = mongoose.model('User',userSchema);

module.exports = {User};