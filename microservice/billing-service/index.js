const express = require("express");
const mongoose = require("mongoose");
const { Kafka } = require("kafkajs");
const cors = require("cors");
const Invoice = require("./models/Invoice");
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
    console.log("MongoDB connected successfully for Billing Service");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Kafka setup
const kafka = new Kafka({
  clientId: "billing-service",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: "billing-group" });

const startConsumer = async () => {
  await consumer.connect();
  console.log("Billing Service Consumer connected!");

  await consumer.subscribe({ topic: "payment-completed", fromBeginning: false });
  console.log("Billing Service subscribed to topic 'payment-completed'");

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const paymentData = JSON.parse(message.value.toString());

        console.log("Generating invoice for payment:", paymentData);

        const invoice = new Invoice({
          paymentId: paymentData.paymentId,
          orderId: paymentData.orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          invoiceNumber: `INV-${Date.now()}`,
        });

        await invoice.save();
        console.log("Invoice created successfully:", invoice);
      } catch (err) {
        console.error("Error processing invoice:", err);
      }
    },
  });
};

startConsumer().catch(console.error);

app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

app.get("/api/invoices/:orderId", async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ orderId: req.params.orderId });
    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    res.json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Error fetching invoice" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Billing service running on port ${PORT}`);
});
