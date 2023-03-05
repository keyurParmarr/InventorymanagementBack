const express = require("express");
const contactUs = require("../CONTROLLER/contactusController");
const protect = require("../MIDDLEWARE/authMiddleware");
const router = express.Router();
router.post("/", protect, contactUs);
module.exports = router;
