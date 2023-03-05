const asyncHandler = require("express-async-handler");
const User = require("../MODEL/userModel");
const sendMail = require("../UTILS/sendEmail");

const contactUs = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new Error("User not found");
  }
  if (!subject || !message) {
    res.status(400);
    throw new Error("Please add subject or message");
  }

  const sent_to = process.env.EMAIL_USER;
  const sent_from = process.env.EMAIL_USER;
  const reply_to = user.email;
  try {
    await sendMail(subject, message, sent_to, sent_from, reply_to);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500);
    throw new Error("Email not sent,please try again");
  }
});
module.exports = contactUs;
