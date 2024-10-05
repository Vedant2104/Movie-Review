const { default: mongoose } = require("mongoose")


async function handleConnect(){
    mongoose.connect("mongodb://127.0.0.1:27017/Movie-Review").then(()=>{
        console.log("Connected to MongoDB");
    });
}

module.exports = {
    handleConnect
}