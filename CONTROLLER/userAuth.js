const asyncHandler = require("express-async-handler");
const User = require("../MODEL/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const Token = require("../MODEL/tokenModel");
const sendMail = require("../UTILS/sendEmail");
const genToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
//create user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !password || !email) {
    res.status(400);
    throw new Error("PLEASE FILL DETAILS");
  }
  if (password.length < 6) {
    res.status(400);
    throw new Error("PASSWORD MUST BE GREATER THAN 6 CHARACTERS");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("EMAIL ALREADY REGISTERED");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  const token = genToken(user._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
      _id,
      email,
      name,
      phone,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("INVALID USER DATA");
  }
});
//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please Add Email And Password");
  }
  const userData = await User.findOne({ email });
  if (!userData) {
    res.status(400);
    throw new Error("User Doesn't Exists");
  }
  const checkpass = await bcrypt.compare(password, userData.password);
  const token = genToken(userData._id);
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });
  if (userData && checkpass) {
    const { _id, name, email, photo, phone, bio } = userData;
    res.status(200).json({
      _id,
      email,
      name,
      phone,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});
//logout user
const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Logged out" });
});
//get user data
const getuserProfile = asyncHandler(async (req, res) => {
  const user1 = await User.findById(req.user._id);
  if (user1) {
    const { _id, name, email, photo, phone, bio } = user1;
    res.status(201).json({
      _id,
      email,
      name,
      phone,
      photo,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("USER NOT FOUND");
  }
});
//login status
const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.json(true);
  }
  return res.json(false);
});
//update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    user.name = req.body.name || name;
    user.email = req.body.email || email;
    user.photo = req.body.photo || photo;
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    const updateduser = await user.save();
    res.status(200).json({
      _id: updateduser._id,
      name: updateduser.name,
      email: updateduser.email,
      phone: updateduser.phone,
      photo: updateduser.photo,
      bio: updateduser.bio,
    });
  } else {
    res.status(401);
    throw new Error("User not found");
  }
});
//change password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  if (!oldPassword && !password) {
    res.status(400);
    throw new Error("Please enter oldpassword & new password");
  }
  const passCorrect = await bcrypt.compare(oldPassword, user.password);
  if (user && passCorrect) {
    user.password = password;
    await user.save();
    res.status(200).send("Password changed sucessfully");
  } else {
    res.status(401);
    throw new Error("Invalid Old password");
  }
});
//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("User not found");
  }
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await Token.deleteOne();
  }
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);
  const hashedToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000),
  }).save();
  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
  const message = `
  <h2>Hello ${user.name}</h2>
  <p>Please use the url below to reset your password</p>
  <p>This reset link is valid for only 30 minutes</p>
  <a href=${resetUrl}>${resetUrl}</a>
  <p>Regards...</p>
  <p>Inventory Management</p>
  `;
  const subject = "Password Reset Request";
  const sent_to = user.email;
  const sent_from = process.env.EMAIL_USER;
  try {
    await sendMail(subject, message, sent_to, sent_from);
    res
      .status(200)
      .json({ success: true, message: "Reset email sent successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500);
    throw new Error("Email not sent,please try again");
  }
});
//reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired token");
  }
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({ message: "Password Reset Successfully,Please Login" });
});
module.exports = {
  registerUser,
  loginUser,
  logOut,
  getuserProfile,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
