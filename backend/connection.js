const { default: mongoose } = require("mongoose")


async function handleConnect(){
    const url = process.env.url;

    mongoose.connect(url).then(()=>{
        console.log("Connected to MongoDB");
    });
}

module.exports = {
    handleConnect
}