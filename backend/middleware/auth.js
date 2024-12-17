const jwt = require("jsonwebtoken");
const mongooseUser = require("../models/user");
require('dotenv').config();

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await mongooseUser.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user; // Attach user to the request object
    next();
  } catch (e) {
    res.status(401).json({ message: "invalid token" });
  }
};

module.exports = authMiddleware;
