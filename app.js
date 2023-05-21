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
// const middleware = (req, res, next) => {
//   console.log("middleware");
//   console.log(req.body);
//   next();
//   console.log(req.body);
//   res.send("test2").status(200);

//   console.log("middleware22");
// };
// app.post("/test", middleware, (req, res) => {
//   console.log("test");
//   console.log(req.body);
// });
app.use(cookieParser());
app.use(errorHandler);
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
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
    console.log(err);
  });
