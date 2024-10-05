const express = require("express");
const {handleGetProfile} = require("../controllers/profile");
const {handleUpdateUser} = require('../controllers/profile');
const router = express.Router();

router.get("/user-info",handleGetProfile);
router.post('/update',handleUpdateUser);
module.exports = router