const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./ROUTES/authRoute");
const productRoute = require("./ROUTES/productRoute");
const contactRoute = require("./ROUTES/contactUsRoute");
const errorHandler = require("./MIDDLEWARE/errorHandler");
const cookieParser = require("cookie-parser");
const path = require("path");
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(errorHandler);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use("/upload", express.static(path.join(__dirname, "uploads")));
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/contactus", contactRoute);
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`SERVER RUNNING ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err, "29");
  });
