const { producer } = require("../utils/kafka");

const orderController = {
  createOrder: async (req, res) => {
    const { userId, basket } = req.body;

    if (!userId || !basket || basket.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    try {
      const totalAmount = basket.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Sipariş oluşturma işlemini burada veritabanınıza kaydedebilirsiniz.
      // orderId gibi bir id oluşturun.
      const orderId = "ORD-" + Date.now(); // örnek ID üretimi

      // Kafka'ya sipariş oluşturma mesajı gönder
      await producer.send({
        topic: "order-created",
        messages: [
          {
            value: JSON.stringify({ userId, basket, totalAmount, orderId }),
          },
        ],
      });

      res.status(200).json({ message: "Order created", orderId, totalAmount });
    } catch (error) {
      console.error("Error in createOrder:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },
};

module.exports = orderController;
