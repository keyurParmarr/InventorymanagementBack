const asyncHandler = require("express-async-handler");
const Product = require("../MODEL/productModel");
const { fileSizeFormatter } = require("../UTILS/uploadImage");
const cloudinary = require("../UTILS/cloudinary.config");

//create product
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, description, image, category, quantity, price } = req.body;
  if (!name || !description || !category || !quantity || !price) {
    res.status(201);
    throw new Error("Please fill up All Details");
  }
  let uploadfile;
  try {
    uploadfile = await cloudinary.uploader.upload(req.file.path, {
      folder: "UPLOADS",
      resource_type: "image",
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Image not Uploaded");
  }
  let fileData = {};
  if (req.file) {
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadfile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  const product = await Product.create({
    name,
    user: req.user._id,
    sku,
    description,
    quantity,
    price,
    category,
    sku,
    image: fileData,
  });
  res.status(201).send(product);
});
//get all product
const getProducts = asyncHandler(async (req, res) => {
  const product = await Product.find({ user: req.user.id }).sort("createdAt");
  res.status(200).json(product);
});
//Get Single Product
const getsingleProduct = asyncHandler(async (req, res) => {
  const singleproduct = await Product.findById(req.params.id);
  if (!singleproduct) {
    res.status(404);
    throw new Error("No products found");
  }
  if (singleproduct.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Unauthourized User");
  }
  res.status(200).json(singleproduct);
});
//Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
  const delProduct = await Product.findByIdAndDelete(req.params.id);
  const { id } = req.params;
  if (!delProduct) {
    res.status(404);
    throw new Error("No products found");
  }
  if (delProduct.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Unauthourized User");
  }
  await delProduct.remove();
  res.status(200).json({ message: "Product Deleted" });
});
//updated Product
const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, category, quantity, price } = req.body;
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    res.status(404);
    throw new Error("No products found for Updation");
  }
  if (product.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Unauthourized User");
  }
  let uploadfile;
  try {
    uploadfile = await cloudinary.uploader.upload(req.file.path, {
      folder: "UPLOADS",
      resource_type: "image",
    });
    console.log(req.file.path);
  } catch (error) {
    console.log(error);
    res.status(500);
    throw new Error("Image not Uploaded");
  }
  let fileData = {};
  if (req.file) {
    fileData = {
      fileName: req.file.originalname,
      filePath: uploadfile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    };
  }
  const updatedProduct = await Product.findByIdAndUpdate(
    { _id: id },
    {
      name,
      description,
      quantity,
      price,
      category,
      image: Object.keys(fileData).length === 0 ? product?.image : fileData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json(updatedProduct);
});

module.exports = {
  createProduct,
  getProducts,
  getsingleProduct,
  deleteProduct,
  updateProduct,
};
