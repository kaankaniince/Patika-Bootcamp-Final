const { producer } = require("../utils/kafka");
const basketService = require("../services/basket"); // Import basketService to use the clearBasket functionality

const orderController = {
  createOrder: async (req, res) => {
    const { userId, basket, paymentMethod, cardNumber, cardHolder, cvv, amount } = req.body;

    console.log("Received data in createOrder:", req.body);

    if (!userId || !basket || basket.length === 0 || !paymentMethod || !amount) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    try {
      const totalAmount = basket.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const orderId = `ORD-${Date.now()}`;

      // Send order details to Kafka topic "order-created"
      await producer.send({
        topic: "order-created",
        messages: [
          {
            value: JSON.stringify({
              userId,
              basket,
              totalAmount,
              orderId,
              paymentMethod,
              cardNumber,
              cardHolder,
              cvv,
            }),
          },
        ],
      });

      // Clear the user's cart after the order is successfully created
      await basketService.clearBasket({ userId });

      res.status(200).json({ message: "Order created and cart cleared", orderId, totalAmount });
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = orderController;
