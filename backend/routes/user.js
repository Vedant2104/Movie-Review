const express = require("express");
const {handleSignUp, handleSignIn,handleLogout,handleForgotPassword,handleResetPassword} = require("../controllers/user");
const router = express.Router();

router.post("/signup",handleSignUp);
router.post("/signin",handleSignIn);
router.post('/logout',handleLogout);
router.post('/forgot-password',handleForgotPassword);
router.post('/reset-password',handleResetPassword);

module.exports = router;