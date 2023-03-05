const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getsingleProduct,
  deleteProduct,
  updateProduct,
} = require("../CONTROLLER/productController");
const protect = require("../MIDDLEWARE/authMiddleware");
const { upload } = require("../UTILS/uploadImage");
router.post("/", protect, upload.single("image"), createProduct);
router.get("/getall", protect, getProducts);
router.get("/getsingle/:id", protect, getsingleProduct);
router.delete("/deleteproduct/:id", protect, deleteProduct);
router.patch(
  "/updateproduct/:id",
  protect,
  upload.single("image"),
  updateProduct
);
module.exports = router;
