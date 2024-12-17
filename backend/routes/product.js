const express = require("express");
const productController = require("../controllers/product");
const authMiddleware = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}.jpg`);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  productController.createProduct
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  productController.updateProduct
);
router.delete("/:id", authMiddleware, productController.deleteProduct);
router.get("/:slug", productController.getProduct);
router.get("/", productController.getProducts);

module.exports = router;
