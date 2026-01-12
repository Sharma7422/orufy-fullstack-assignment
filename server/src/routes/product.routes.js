const express = require("express");
const router = express.Router();
const upload = require("./../middlewares/multer");
const authMiddleware = require("./../middlewares/auth.middleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updatePublishStatus,
} = require("./../controllers/product.controller");


router.post("/create", authMiddleware, upload.array("productImages", 5), createProduct);
router.get("/list", authMiddleware, getProducts);
router.get("/view/:id", authMiddleware, getProductById);
router.put("/edit/:id", authMiddleware, upload.array("productImages", 5), updateProduct);
router.delete("/delete/:id", authMiddleware, deleteProduct);
router.put("/status/:id", authMiddleware, updatePublishStatus);

module.exports = router;
