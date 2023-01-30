const express = require("express");
const router = express.Router();
const registerUser = require("../CONTROLLER/userRegister");

router.post("/register", registerUser);
module.exports = router;
