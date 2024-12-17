import { IconPencil, IconTrash, IconUserPlus } from "@tabler/icons-react";
import {
  ActionIcon,
  Anchor,
  Avatar,
  Badge,
  Group,
  Table,
  Text,
  Title,
  Loader,
  Stack,
  Button,
  Modal,
  TextInput,
  Select,
  PasswordInput,
} from "@mantine/core";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

export function Customers() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
  });
  const [editUser, setEditUser] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user");
      const fetchedData = response.data.response;
      setData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.filter((user) => user._id !== userId));
      showNotification({
        title: "Customer Deleted",
        message: "The customer has been deleted successfully.",
        color: "green",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification({
        title: "Error",
        message: "Failed to delete the customer. Please try again.",
        color: "red",
      });
    }
  };

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        newUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) => [...prevData, response.data.user]);
      showNotification({
        title: "Customer Created",
        message: "The customer has been added successfully.",
        color: "green",
      });
      setModalOpen(false);
      setNewUser({ username: "", email: "", password: "", role: "" });
    } catch (error) {
      console.error("Error adding user:", error);
      showNotification({
        title: "Error",
        message: "Failed to add the customer. Please try again.",
        color: "red",
      });
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setUpdateModalOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/user/${editUser._id}`,
        editUser,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updatedUser = response.data;
      setData((prevData) =>
        prevData.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );
      showNotification({
        title: "Customer Updated",
        message: "The customer has been updated successfully.",
        color: "green",
      });
      setUpdateModalOpen(false);
      setEditUser(null);
      fetchData();
    } catch (error) {
      console.error("Error updating user:", error);
      showNotification({
        title: "Error",
        message: "Failed to update the customer. Please try again.",
        color: "red",
      });
    }
  };

  const roleColors = {
    customer: "blue",
    admin: "teal",
  };

  if (loading) {
    return (
      <Stack align="center" justify="center" style={{ height: "100vh" }} spacing="md">
        <Loader size="lg" />
        <Text>Loading Customers, please wait...</Text>
      </Stack>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <Stack align="center" spacing="md">
        <Text size="lg" c="gray">No customers found</Text>
      </Stack>
    );
  }

  const rows = data.map((item) => {
    if (!item) return null; // Skip completely invalid entries
    return (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Group gap="sm">
            <Avatar size={30} src={item.avatar || ""} radius={30} color="blue">
              {item.username?.charAt(0).toUpperCase() || "?"}
            </Avatar>
            <Text fz="sm" fw={500}>
              {item.username || "Unknown"}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Badge color={roleColors[item.role] || "gray"} variant="light">
            {item.role || "Unknown"}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Anchor component="button" size="sm">
            {item.email || "No Email"}
          </Anchor>
        </Table.Td>
        <Table.Td>
          <Group gap={0} spacing="xs">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={() => handleEdit(item)}
            >
              <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => handleDelete(item._id)}
            >
              <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
          </Group>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div style={{ overflowX: "auto", minWidth: "800px" }}>
      <Group position="apart" mb="lg">
        <Title order={2}>Customer List</Title>
        <Button
          lefticon={<IconUserPlus size={16} />}
          color="green"
          onClick={() => setModalOpen(true)}
        >
          Add Customer
        </Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Username</Table.Th>
            <Table.Th>Role</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* Add User Modal */}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Customer"
      >
        <Stack spacing="sm">
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <PasswordInput
            label="Password"
            placeholder="Enter password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <Select
            label="Role"
            placeholder="Select role"
            data={[
              { value: "customer", label: "Customer" },
              { value: "admin", label: "Admin" },
            ]}
            value={newUser.role}
            onChange={(value) => setNewUser({ ...newUser, role: value })}
          />
          <Button color="blue" onClick={handleAddUser}>
            Add Customer
          </Button>
        </Stack>
      </Modal>

      {/* Update User Modal */}
      <Modal
        opened={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        title="Update Customer"
      >
        <Stack spacing="sm">
          <TextInput
            label="Username"
            placeholder="Enter username"
            value={editUser?.username || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, username: e.target.value })
            }
          />
          <TextInput
            label="Email"
            placeholder="Enter email"
            value={editUser?.email || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
          />
          <PasswordInput
            label="Password"
            placeholder="Enter new password (optional)"
            value={editUser?.password || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, password: e.target.value })
            }
          />
          <Select
            label="Role"
            placeholder="Select role"
            data={[
              { value: "customer", label: "Customer" },
              { value: "admin", label: "Admin" },
            ]}
            value={editUser?.role || ""}
            onChange={(value) => setEditUser({ ...editUser, role: value })}
          />
          <Button color="blue" onClick={handleUpdateUser}>
            Update Customer
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}

