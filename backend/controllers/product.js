const productService = require("../services/product");
const productController = {
  createProduct: async (req, res) => {
    try {
      console.log("Uploaded file:", req.file);
      const product = await productService.createProduct(req.body, req.file);
      if (!product) {
        return res.status(400).json({ message: "Product creation failed" });
      }
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updateFields = req.body;
      const file = req.file;

      console.log("Update request received:", {
        id,
        fields: updateFields,
        file: file ? file.filename : "No file",
      });

      const response = await productService.updateProduct(
        {
          id,
          ...updateFields,
        },
        file
      );

      res.status(200).json({ response });
    } catch (e) {
      console.error("Error in updateProduct controller:", e);
      res.status(400).json({ error: e.message || "Error updating product" });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const response = await productService.deleteProduct(req.params);
      console.log(response, "result");
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
    }
  },
  getProduct: async (req, res) => {
    try {
      const response = await productService.getProduct(req.params);
      console.log(response, "result");
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
  getProducts: async (req, res) => {
    try {
      const response = await productService.getProducts();
      console.log(response, "result");
      res.status(200).send({ response: response });
    } catch (e) {
      console.log(e, "error");
      res.status(500).send({ error: "Internal Server Error" });
    }
  },
};
module.exports = productController;
