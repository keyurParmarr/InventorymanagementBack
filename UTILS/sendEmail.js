const nodemailer = require("nodemailer");
const sendMail = async (sub, message, send_To, sent_From, reply_To) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const options = {
    from: sent_From,
    to: send_To,
    replyTo: reply_To,
    subject: sub,
    html: message,
  };
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    }
    console.log(info);
  });
};

module.exports = sendMail;
