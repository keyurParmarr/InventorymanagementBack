const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logOut,
  getuserProfile,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../CONTROLLER/userAuth");
const protect = require("../MIDDLEWARE/authMiddleware");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logOut);
router.get("/getuser", protect, getuserProfile);
router.get("/loginstatus", loginStatus);
router.patch("/updateuser", protect, updateUser);
router.patch("/changepassword", protect, changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);
module.exports = router;
