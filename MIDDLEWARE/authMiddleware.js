const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../MODEL/userModel");
const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not Authorized,Please Login");
    }
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(verifyToken.id).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not Authorized,Please Login");
  }
});
module.exports = protect;
