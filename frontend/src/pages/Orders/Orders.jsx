import React, { useState } from "react";
import { Table, Card, Badge, Button, Group, Stack, Title, Modal, TextInput, NumberInput, Select } from "@mantine/core";

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      username: "John Doe",
      email: "johndoe@example.com",
      orderStatus: "Pending",
      totalPrice: 85,
      createdAt: "2024-12-14T10:00:00Z",
      products: [
        { productName: "Book A", quantity: 2, price: 25 },
        { productName: "Book B", quantity: 1, price: 35 },
      ],
    },
    {
      id: "ORD002",
      username: "Jane Smith",
      email: "janesmith@example.com",
      orderStatus: "Shipped",
      totalPrice: 50,
      createdAt: "2024-12-13T15:00:00Z",
      products: [{ productName: "Book C", quantity: 1, price: 50 }],
    },
  ]);

  // State for modal
  const [opened, setOpened] = useState(false);
  const [newOrder, setNewOrder] = useState({
    id: "",
    username: "",
    email: "",
    orderStatus: "Pending",
    totalPrice: 0,
    createdAt: new Date().toISOString(),
    products: [],
  });

  const addOrder = () => {
    setOrders([...orders, { ...newOrder, id: `ORD${orders.length + 1}` }]);
    setNewOrder({
      id: "",
      username: "",
      email: "",
      orderStatus: "Pending",
      totalPrice: 0,
      createdAt: new Date().toISOString(),
      products: [],
    });
    setOpened(false);
  };

  return (
    <Stack>
      {/* Add Order Button */}
      <Group position="apart" mb="lg">
        <Title order={2}>Orders</Title>
        <Button onClick={() => setOpened(true)} variant="gradient" gradient={{ from: "teal", to: "blue", deg: 60 }}>
          Add Order
        </Button>
      </Group>

      {/* Modal for Adding Orders */}
      <Modal opened={opened} onClose={() => setOpened(false)} title="Add New Order" centered>
        <Stack spacing="sm">
          <TextInput
            label="Customer Name"
            placeholder="Enter customer name"
            value={newOrder.username}
            onChange={(e) => setNewOrder({ ...newOrder, username: e.target.value })}
            required
          />
          <TextInput
            label="Customer Email"
            placeholder="Enter customer email"
            value={newOrder.email}
            onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
            required
          />
          <Select
            label="Order Status"
            data={["Pending", "Shipped", "Delivered"]}
            value={newOrder.orderStatus}
            onChange={(value) => setNewOrder({ ...newOrder, orderStatus: value })}
            required
          />
          <NumberInput
            label="Total Price"
            placeholder="Enter total price"
            value={newOrder.totalPrice}
            onChange={(value) => setNewOrder({ ...newOrder, totalPrice: value })}
            required
          />
          <Button onClick={addOrder} fullWidth variant="gradient" gradient={{ from: "teal", to: "blue", deg: 60 }}>
            Add Order
          </Button>
        </Stack>
      </Modal>

      {/* Orders List */}
      {orders.map((order) => (
        <Card shadow="sm" padding="lg" radius="md" withBorder key={order.id}>
          <Group position="apart" mb="sm">
            <div>
              <Title order={4}>Order ID: {order.id}</Title>
              <div>
                <strong>Customer:</strong> {order.username} ({order.email})
              </div>
              <div>
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <Badge color={order.orderStatus === "Pending" ? "yellow" : order.orderStatus === "Shipped" ? "green" : "blue"}>
              {order.orderStatus}
            </Badge>
          </Group>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Quantity</Table.Th>
                <Table.Th>Price</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {order.products.map((product, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{product.productName}</Table.Td>
                  <Table.Td>{product.quantity}</Table.Td>
                  <Table.Td>${product.price}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group position="apart" mt="md">
            <div>
              <strong>Total Price:</strong> ${order.totalPrice}
            </div>
            <Button variant="light" color="blue" size="xs">
              View Details
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  );
};

export default Orders;
