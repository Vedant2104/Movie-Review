const express = require("express");
const {handleGetProfile} = require("../controllers/profile");

const router = express.Router();

router.get("/user-info",handleGetProfile);
module.exports = router