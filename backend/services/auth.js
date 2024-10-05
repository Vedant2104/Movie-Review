const jwt = require("jsonwebtoken");
const secret = "Vedant$999";
// console.log(process.env.secret);
// const secret = process.env.secret;

function setUser(user) {
  return jwt.sign(
    {
      user
    },
    secret
  );
}

function getUser(token) {
    try{

        return jwt.verify(token, secret).user;
    }
    catch(err){
        return null;
    }
}
module.exports = { setUser, getUser}