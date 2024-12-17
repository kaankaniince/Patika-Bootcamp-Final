const mongoose = require("mongoose");

//Schema

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requried: true,
    },
    email: {
      type: String,
      requried: true,
      unique: true,
    },
    password: {
      type: String,
      requried: true,
    },
    role: {
      type: String,
      enum: ["customer", "admin"],
      default:"customer",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
