const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./user");
const productRouter = require("./product");
const contactRouter = require("./contact")
const basketRouter = require("./basket")
const orderRouter = require("./order");

const router = express.Router();
router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/contact", contactRouter);
router.use('/basket', basketRouter);
router.use("/order", orderRouter);

module.exports = router;
