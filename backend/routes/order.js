const express = require("express");
const orderController = require("../controllers/order.js");

const router = express.Router();

router.post("/create-order", orderController.createOrder);

module.exports = router;
