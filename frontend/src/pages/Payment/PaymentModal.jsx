import React, { useState } from "react";
import {
  Modal,
  Button,
  TextInput,
  Select,
  Group,
  NumberInput,
  Text,
  Box,
} from "@mantine/core";

const PaymentModal = ({ opened, onClose, onSubmit, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cvv, setCvv] = useState("");

  const handlePayment = () => {
    // Send payment details
    onSubmit({
      paymentMethod,
      cardNumber,
      cardHolder,
      cvv,
      amount: totalAmount,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Make a Payment"
      size="lg"
      centered
    >
      <Box
        style={{
          backgroundColor: "#f8f9fa",
          padding: "15px",
          borderRadius: "8px",
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <Text size="xl" weight={700} color="green">
          Total Price: ${totalAmount.toFixed(2)}
        </Text>
      </Box>

      <Select
        label="Payment Method"
        data={[
          { value: "credit_card", label: "Credit Card" },
          { value: "paypal", label: "PayPal" },
          { value: "bank_transfer", label: "Bank Transfer" },
        ]}
        value={paymentMethod}
        onChange={setPaymentMethod}
      />

      {paymentMethod === "credit_card" && (
        <>
          <TextInput
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={(event) => setCardNumber(event.target.value)}
            required
          />
          <TextInput
            label="Cardholder Name"
            placeholder="Full Name"
            value={cardHolder}
            onChange={(event) => setCardHolder(event.target.value)}
            required
          />
          <NumberInput
            label="CVV"
            placeholder="123"
            value={cvv}
            onChange={setCvv}
            required
          />
        </>
      )}

      <Group position="right" mt="md">
        <Button onClick={onClose} variant="default">
          Cancel
        </Button>
        <Button onClick={handlePayment} color="green">
          Pay Now
        </Button>
      </Group>
    </Modal>
  );
};

export default PaymentModal;
