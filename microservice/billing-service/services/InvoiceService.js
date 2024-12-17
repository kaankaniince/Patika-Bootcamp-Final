const { Kafka } = require('kafkajs');
const Invoice = require('../models/Invoice');

class InvoiceService {
  constructor() {
    this.kafka = new Kafka({
      clientId: 'billing-service',
      brokers: [process.env.KAFKA_BROKER]
    });
    this.consumer = this.kafka.consumer({ groupId: 'billing-group' });
    this.setupConsumer();
  }

  async setupConsumer() {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'payment-completed', fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const paymentData = JSON.parse(message.value.toString());
        await this.createInvoice(paymentData);
      }
    });
  }

  async createInvoice(paymentData) {
    const invoice = new Invoice({
      paymentId: paymentData.paymentId,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      invoiceNumber: `INV-${Date.now()}`
    });

    await invoice.save();
    return invoice;
  }
}

module.exports = new InvoiceService(); 