const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "ecommerce-backend",
  brokers: ["localhost:9092"], // Kafka broker adresini buraya yazın
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "ecommerce-group" });

const connectKafka = async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer connected!");

    await consumer.connect();
    console.log("Kafka Consumer connected!");
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
  }
};

module.exports = {
  producer,
  consumer,
  connectKafka,
};
