const mongoose = require("mongoose");
const slugify = require("slugify");

// Schema
const productSchema = new mongoose.Schema(
  {
    image: {
      type: String,
    },
    productName: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        "Fiction",
        "Non-Fiction",
        "Biography",
        "Science and Technology",
        "Philosophy",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.pre("save", function (next) {
  if (this.isModified("productName")) {
    this.slug = slugify(this.productName, {
      lower: true,
      strict: true,
    });
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
