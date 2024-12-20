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
  Divider
} from "@mantine/core";

const Cart = () => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!user || !isAuthenticated) return;
    try {
      const response = await axios.get(`http://host.docker.internal:3000/api/basket/${user.userId}`);
      setCart(response.data.response || []);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user, isAuthenticated]);

  const handleRemove = async (productId) => {
    // Bu fonksiyonun backend tarafında quantity azaltacak şekilde ayarlandığını varsayıyoruz.
    try {
      await axios.delete("http://host.docker.internal:3000/api/basket", {
        data: { userId: user.userId, productId },
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const handleAdd = async (item) => {
    // Bu fonksiyon product eklerken quantity artırır diye varsayıyoruz.
    try {
      await axios.post("http://host.docker.internal:3000/api/basket", {
        userId: user.userId,
        product: {
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          category: item.category,
          author: item.author,
          image: item.image,
          description: item.description,
          stock: item.stock,
          slug: item.slug
        }
      });
      fetchCart();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleClear = async () => {
    try {
      await axios.post("http://host.docker.internal:3000/api/basket/clear", {
        userId: user?.userId,
      });
      fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
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

  // Toplam fiyat hesaplama
  const totalPrice = cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

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
          <Button variant="outline" size="xs" onClick={() => handleRemove(item.productId)}>-</Button>
          <Text>{item.quantity || 1}</Text>
          <Button variant="outline" size="xs" onClick={() => handleAdd(item)}>+</Button>
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
        <Text fw={700} fz="lg">Total Price: ${totalPrice.toFixed(2)}</Text>
      </Flex>

      <Group justify="space-between" mt="md">
        <Button color="red" onClick={handleClear}>
          Clear Cart
        </Button>
        <Button color="green">
        Payment
        </Button>
      </Group>
    </Container>
  );
};

export default Cart;
