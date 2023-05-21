const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Write Your Name"],
    },
    email: {
      type: String,
      required: [true, "Please Write Your Email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please enter an valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please Write an Password"],
      minlength: [6, "Password must not be up to 6 Characters"],
    },
    photo: {
      type: String,
      required: [true, "Please Write an Password"],
      default: "https://i.ibb.co/4pDNDk1/avatar.png",
    },
    phone: {
      type: String,
      default: "+91",
    },
    bio: {
      type: String,
      default: "bio",
      maxlength: [250, "Bio must not be up to 250 Characters"],
    },
  },
  {
    timestamp: true,
  }
);
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(this.password, salt);
  this.password = hashedpassword;
  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
