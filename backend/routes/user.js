const express = require("express");
const {handleSignUp, handleSignIn,handleLogout,handleForgotPassword,handleResetPassword,handleChangeRole} = require("../controllers/user");
const { checkUser } = require("../middleware/auth");
const router = express.Router();

router.post("/signup",handleSignUp);
router.post("/signin",handleSignIn);
router.post('/logout',handleLogout);
router.post('/forgot-password',handleForgotPassword);
router.post('/reset-password',handleResetPassword);
router.post('/change-role',checkUser,handleChangeRole);

module.exports = router;