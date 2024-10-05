const jwt = require("jsonwebtoken");
const secret = "Vedant$999";

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