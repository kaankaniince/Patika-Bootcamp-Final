const express = require('express');
const mongoose = require('mongoose');
const { Kafka } = require('kafkajs');
const cors = require('cors');
const Payment = require('./models/Payment');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Kafka yapılandırması
const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKER || 'kafka:29092']
});

const producer = kafka.producer();

// MongoDB bağlantısı
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected successfully');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Test endpoint'i
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Ödeme endpoint'i
app.post('/api/payments', async (req, res) => {
  try {
    const { orderId, amount, currency, paymentMethod } = req.body;
    
    const payment = new Payment({
      orderId,
      amount,
      currency,
      paymentMethod,
      status: 'completed'
    });
    
    await payment.save();

    await producer.connect();
    await producer.send({
      topic: 'payment-completed',
      messages: [
        { 
          value: JSON.stringify({
            paymentId: payment._id,
            orderId,
            amount,
            currency
          })
        }
      ]
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Payment service running on port ${PORT}`);
}); 