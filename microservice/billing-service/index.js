const express = require('express');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const cors = require('cors');
const Invoice = require('./models/Invoice');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Kafka yapılandırması
const kafka = new Kafka({
  clientId: 'billing-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092']
});

const consumer = kafka.consumer({ groupId: 'billing-group' });

// Test endpoint'i
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Fatura sorgulama endpoint'i
app.get('/api/invoices/:orderId', async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ orderId: req.params.orderId });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Error fetching invoice' });
  }
});

// Kafka consumer'ı başlat
const startConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'payment-completed', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const paymentData = JSON.parse(message.value.toString());
      
      const invoice = new Invoice({
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        invoiceNumber: `INV-${Date.now()}`
      });

      await invoice.save();
      console.log('Invoice created:', invoice);
    }
  });
};

startConsumer().catch(console.error);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Billing service running on port ${PORT}`);
}); 