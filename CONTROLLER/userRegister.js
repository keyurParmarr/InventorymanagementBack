const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../MODEL/userModel");
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
  // if (password.length > 15) {
  //   res.status(400);
  //   throw new Error("PASSWORD MUST NOT BE GREATER THAN 15 CHARACTERS");
  // }
  res.status(200).send("USER REGISTERED");
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("EMAIL ALREADY REGISTERED");
  }

  const createuser = await User.create({
    name,
    email,
    password,
  });
  if (createuser) {
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
module.exports = registerUser;
