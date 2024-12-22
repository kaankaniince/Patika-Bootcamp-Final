const express = require("express");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");
const cors = require("cors");
const Payment = require("./models/Payment");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected successfully for Payment Service");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Kafka setup
const kafka = new Kafka({
  clientId: "payment-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "payment-group" });

const startConsumer = async () => {
  await consumer.connect();
  console.log("Payment Service Consumer connected!");

  await consumer.subscribe({ topic: "order-created", fromBeginning: false });
  console.log("Payment Service subscribed to topic 'order-created'");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const orderData = JSON.parse(message.value.toString());
        const { orderId, totalAmount, paymentMethod, cardNumber, cardHolder } = orderData;

        console.log("Processing payment for order:", orderData);

        const payment = new Payment({
          orderId,
          amount: totalAmount,
          currency: "USD",
          paymentMethod,
          cardNumber: paymentMethod === "credit_card" ? cardNumber : null,
          cardHolder: paymentMethod === "credit_card" ? cardHolder : null,
          status: "completed",
        });

        await payment.save();

        // Notify billing service via Kafka
        await producer.send({
          topic: "payment-completed",
          messages: [
            {
              value: JSON.stringify({
                paymentId: payment._id.toString(),
                orderId,
                amount: payment.amount,
                currency: payment.currency,
                basket: orderData.basket,
              }),
            },
          ],
        });

        console.log(`Payment completed for order ${orderId}. Payment ID: ${payment._id}`);
      } catch (err) {
        console.error("Error processing payment:", err);
      }
    },
  });
};

startConsumer().catch(console.error);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  console.log(`Payment service running on port ${PORT}`);
  await producer.connect().catch(console.error);
});
