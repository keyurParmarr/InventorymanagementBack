const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userRoute = require("./ROUTES/userRoute");
const errorHandler = require("./MIDDLEWARE/errorHandler");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.send("hello");
});
app.use("/api/user", userRoute);
const PORT = process.env.PORT || 5000;
app.use(errorHandler);
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
