const express = require("express");
const {handleSignUp, handleSignIn,} = require("../controllers/user");
const router = express.Router();


router.post("/signup",handleSignUp);
router.post("/signin",handleSignIn);

module.exports = router;