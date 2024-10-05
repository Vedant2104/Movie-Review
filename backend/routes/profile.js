const express = require("express");
const {handleGetProfile,handleUpdateUser} = require("../controllers/profile");

const router = express.Router();

router.get("/user-info",handleGetProfile);
router.post("/user-info/update",handleUpdateUser);
module.exports = router