const express = require("express");
const {handleGetProfile,handleUpdateUser,handleAdminPage} = require("../controllers/profile");
const {checkAdmin} = require('../middleware/auth');
const router = express.Router();

router.get("/user-info",handleGetProfile);
router.post("/user-info/update",handleUpdateUser);
router.get('/admin',checkAdmin,handleAdminPage);

module.exports = router