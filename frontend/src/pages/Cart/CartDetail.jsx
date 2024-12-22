import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../store/AuthContext";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Table,
  Image,
  Flex,
  Divider,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications"; // Import Mantine notifications
import PaymentModal from "../Payment/PaymentModal";

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/api/basket/${user.userId}`
      );
      setCart(response.data.response || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, isAuthenticated]);

  const handleClear = async () => {
    try {
      await axios.post("http://localhost:3000/api/basket/clear", {
        userId: user?.userId,
      });
      fetchCart();
      showNotification({
        title: "Cart Cleared",
        message: "Your cart has been successfully cleared.",
        color: "green",
      });
    } catch (error) {
      console.error("Error clearing cart:", error);
      showNotification({
        title: "Error",
        message: "Failed to clear your cart. Please try again.",
        color: "red",
      });
    }
  };

  const handlePayment = () => {
    setModalOpened(true);
  };

  const handleModalSubmit = async (paymentData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/order/create-order", {
        userId: user?.userId,
        basket: cart,
        paymentMethod: paymentData.paymentMethod,
        cardNumber: paymentData.cardNumber,
        cardHolder: paymentData.cardHolder,
        cvv: paymentData.cvv,
        amount: paymentData.amount,
      });

      if (response.data.orderId) {
        showNotification({
          title: "Payment Successful",
          message: `Order ID: ${response.data.orderId}`,
          color: "green",
        });

        // Clear the cart
        setCart([]);

        // Delay before redirecting to the homepage
        setTimeout(() => {
          navigate("/");
        }, 3000); // 3-second delay
      } else {
        showNotification({
          title: "Payment Failed",
          message: "Something went wrong during payment. Please try again.",
          color: "red",
        });
      }
    } catch (error) {
      console.error("Error during payment:", error);
      showNotification({
        title: "Payment Error",
        message: "Payment failed. Please try again later.",
        color: "red",
      });
    } finally {
      setModalOpened(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container>
        <Title order={2}>Please login to view your cart.</Title>
      </Container>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <Container>
        <Title order={2}>Your cart is empty</Title>
      </Container>
    );
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const rows = cart.map((item, index) => (
    <Table.Tr key={index}>
      <Table.Td>
        <Group gap="sm">
          <Image
            height={50}
            width={50}
            src={item.image}
            radius="sm"
            alt={item.productName || "Product image"}
            fit="contain"
          />
          <Text fz="sm" fw={500}>
            {item.productName || "Unnamed Product"}
          </Text>
        </Group>
      </Table.Td>
      <Table.Td>${item.price}</Table.Td>
      <Table.Td>{item.author}</Table.Td>
      <Table.Td>{item.category}</Table.Td>
      <Table.Td>
        <Group spacing="xs">
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleRemove(item.productId)}
          >
            -
          </Button>
          <Text>{item.quantity || 1}</Text>
          <Button
            variant="outline"
            size="xs"
            onClick={() => handleAdd(item)}
          >
            +
          </Button>
        </Group>
      </Table.Td>
      <Table.Td>
        <Text fw={500}>${(item.price * (item.quantity || 1)).toFixed(2)}</Text>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Container>
      <Title order={1} mb="lg">
        Your Cart
      </Title>

      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Quantity</Table.Th>
            <Table.Th>Subtotal</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <Divider my="sm" />

      <Flex justify="flex-end" align="center" mb="sm">
        <Text fw={700} fz="lg">
          Total Price: ${totalPrice.toFixed(2)}
        </Text>
      </Flex>

      <Group justify="space-between" mt="md">
        <Button color="red" onClick={handleClear}>
          Clear Cart
        </Button>
        <Button color="green" onClick={handlePayment}>
          Payment
        </Button>
      </Group>

      <PaymentModal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        onSubmit={handleModalSubmit}
        totalAmount={totalPrice}
      />
    </Container>
  );
};

export default Cart;
