const mongooseProduct = require("../models/product");
const fs = require("fs");
const path = require("path");

async function createProduct(productParams, file) {
  const { productName, author, description, category, price, stock, image } =
    productParams;
  try {
    const imagePath = file ? `/uploads/${file.filename}` : image;
    console.log("Saving image path:", imagePath);
    const newProduct = new mongooseProduct({
      image: imagePath,
      productName,
      author,
      description,
      category,
      price,
      stock,
    });
    await newProduct.save();
    return newProduct;
  } catch (e) {
    console.log("Error saving product:", e);
    return false;
  }
}

async function getProduct(productParams) {
  const { slug } = productParams;
  try {
    const product = await mongooseProduct.findOne({ slug });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (e) {
    console.log(e);
    return false;
  }
}

async function getProducts() {
  try {
    const product = await mongooseProduct.find();
    if (!product) {
      throw new Error("There is no product found");
    }
    return product;
  } catch (e) {
    console.log(e);
    return false;
  }
}

// Cant delete or update pic

async function updateProduct(productData, file) {
  const { id, productName, description, author, category, price, stock } =
    productData;

  try {
    // Find the existing product
    const existingProduct = await mongooseProduct.findById(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    // Handle image update
    let updatedImagePath = existingProduct.image; // Default to existing image

    if (file) {
      // If there's a new file, update the path
      updatedImagePath = `/uploads/${file.filename}`;

      // Delete old image if it exists
      if (existingProduct.image) {
        const oldImagePath = path.join(
          __dirname,
          "..",
          "public",
          existingProduct.image
        );
        try {
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Old image deleted successfully");
          }
        } catch (err) {
          console.error("Error deleting old image:", err);
        }
      }
    }

    // Update the product with new data
    const updatedProduct = await mongooseProduct.findByIdAndUpdate(
      id,
      {
        productName,
        description,
        author,
        category,
        price,
        stock,
        image: updatedImagePath, // Use the updated image path
      },
      { new: true, runValidators: true }
    );

    console.log("Updated product:", updatedProduct);
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
}

async function deleteProduct(productParams) {
  const id = productParams.id;
  try {
    const product = await mongooseProduct.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    if (product.image) {
      const imagePath = path.join(__dirname, "..", product.image);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const productDelete = await mongooseProduct.findByIdAndDelete(id);
    return productDelete;
  } catch (e) {
    console.log(e);
    return false;
  }
}
module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
