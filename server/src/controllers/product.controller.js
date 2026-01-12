const Product = require("./../models/product.model");
const fs = require("fs");
const path = require("path");

// Create Product
exports.createProduct = async (req, res) => {
  try {
    const {
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeOrReturn,
    } = req.body;

    const images = req.files.map((file) => file.filename);

    const isExchangeOrReturn = exchangeOrReturn === "true" || exchangeOrReturn === true || exchangeOrReturn === "Yes";

    const product = new Product({
      userId: req.user._id,
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeOrReturn: isExchangeOrReturn,
      productImages: images,
      publishedStatus: false,
    });

    await product.save();
    res.status(201).json({ success: true, message:"Product created successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET All Products
exports.getProducts = async (req, res) => {
  try {
    const { status } = req.query; 
    
    let query = { userId: req.user._id };
    
    if (status === "published") {
      query.publishedStatus = true;
    } else if (status === "unpublished") {
      query.publishedStatus = false;
    }
    
    const products = await Product.find(query);
    res.status(200).json({ success: true, message: "Products fetched successfully", products });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET Product By ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, message: "Product fetched successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    
    const {
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      exchangeOrReturn,
    } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    // If new images are uploaded, add them
    if (req.files && req.files.length > 0) {
      // Delete old images from server
      product.productImages.forEach((imgName) => {
        const fullPath = path.join(__dirname, "../uploads", imgName);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
      product.productImages = req.files.map((file) => file.filename);
    }

    product.productName = productName || product.productName;
    product.productType = productType || product.productType;
    product.quantityStock = quantityStock || product.quantityStock;
    product.mrp = mrp || product.mrp;
    product.sellingPrice = sellingPrice || product.sellingPrice;
    product.brandName = brandName || product.brandName;
    if (exchangeOrReturn !== undefined) {
      product.exchangeOrReturn = exchangeOrReturn === "true" || exchangeOrReturn === true || exchangeOrReturn === "Yes";
    }

    await product.save();
    res.status(200).json({ success: true, message: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
   const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    
    product.productImages.forEach((imgName) => {
      const fullPath = path.join(__dirname, "../uploads", imgName);
      if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    });

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update Product Publish Status
exports.updatePublishStatus = async (req, res) => {
  try {
    
    const product = await Product.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!product)
      return res.status(404).json({ success: false, message: "Product not found" });

    product.publishedStatus = !product.publishedStatus;
    
    await product.save();
    res.status(200).json({ success: true, message: `Product ${product.publishedStatus ? "published" : "unpublished"} successfully`, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};