import {
  IconPencil,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
  IconPhoto,
} from "@tabler/icons-react";
import {
  ActionIcon,
  Avatar,
  Badge,
  Group,
  Table,
  Text,
  Image,
  Loader,
  Title,
  Stack,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Select,
} from "@mantine/core";
import { useState, useEffect } from "react";
import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";

export function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // New state to toggle between add/edit mode
  const [editProductId, setEditProductId] = useState(null); // To track the product being edited
  const [newProduct, setNewProduct] = useState({
    image: null,
    productName: "",
    description: "",
    price: 0,
    stock: 0,
    category: "",
    author: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://host.docker.internal:3000/api/product");
        setData(response.data.response);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleImageDrop = (files) => {
    const file = files[0];
    setNewProduct({ ...newProduct, image: file });
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setEditProductId(product._id);
    setModalOpen(true);

    setNewProduct({
      productName: product.productName,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      author: product.author || "",
      image: null,
    });

    setImagePreview(`http://host.docker.internal:3000${product.image}`);
  };

  const handleSaveProduct = async () => {
    try {
      setLoading(true); // Add loading state at the start

      const formData = new FormData();
      formData.append("productName", newProduct.productName);
      formData.append("description", newProduct.description);
      formData.append("price", newProduct.price);
      formData.append("stock", newProduct.stock);
      formData.append("category", newProduct.category);
      formData.append("author", newProduct.author);

      if (newProduct.image) {
        formData.append("image", newProduct.image);
      }

      const token = localStorage.getItem("token");
      let response;

      if (isEditing) {
        response = await axios.put(
          `http://host.docker.internal:3000/api/product/${editProductId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update local state immediately
        const updatedProduct = response.data.response;
        setData(prevData =>
          prevData.map(item =>
            item._id === editProductId ? updatedProduct : item
          )
        );
      } else {
        response = await axios.post(
          "http://host.docker.internal:3000/api/product",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Add new product to local state
        const newProductData = response.data.product;
        if (newProductData) {
          setData(prevData => [...prevData, newProductData]);
        }
      }

      // Reset form state
      setModalOpen(false);
      setImagePreview(null);
      setIsEditing(false);
      setNewProduct({
        image: null,
        productName: "",
        description: "",
        price: 0,
        stock: 0,
        category: "",
        author: "",
      });

      // Show success notification
      showNotification({
        title: "Success",
        message: isEditing
          ? "Product updated successfully"
          : "Product added successfully",
        color: "green",
      });

      // Refresh the data
      const refreshResponse = await axios.get("http://host.docker.internal:3000/api/product");
      if (refreshResponse.data.response) {
        setData(refreshResponse.data.response);
      }
    } catch (error) {
      console.error("Error saving product:", error);
      showNotification({
        title: "Error",
        message: "Failed to save product. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    "category 1": "blue",
    "category 2": "teal",
    "category 3": "pink",
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://host.docker.internal:3000/api/product/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) => prevData.filter((product) => product._id !== id));
      showNotification({
        title: "Product Deleted",
        message: "The product has been deleted successfully.",
        color: "green",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      showNotification({
        title: "Error",
        message: "Failed to delete the product. Please try again.",
        color: "red",
      });
    }
  };

  if (loading) {
    return (
      <Stack
        align="center"
        justify="center"
        style={{ height: "100vh" }}
        spacing="md"
      >
        <Loader size="lg" />
        <Text>Loading products, please wait...</Text>
      </Stack>
    );
  }

  if (!loading && data.length === 0) {
    return (
      <Stack align="center" spacing="md">
        <Text size="lg" c="gray">
          No products found
        </Text>
      </Stack>
    );
  }

  const rows = data.map((item) => {
    // Add null check for item
    if (!item) return null;

    return (
      <Table.Tr key={item._id}>
        <Table.Td>
          <Group gap="sm">
            <Image
              h={30}
              w={30}
              src={item.image ? `http://host.docker.internal:3000${item.image}` : null}
              radius={5}
              alt={item.productName || 'Product image'}
              fit="contain"
            />
            <Text fz="sm" fw={500}>
              {item.productName || 'Unnamed Product'}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{item.author || "N/A"}</Text>
        </Table.Td>
        <Table.Td>
          <Badge color={categoryColors[item.category] || "gray"} variant="light">
            {item.category || "Unknown"}
          </Badge>
        </Table.Td>
        <Table.Td>
          <Text size="sm" lineClamp={1}>
            {item.description || 'No description'}
          </Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">{item.stock || 0}</Text>
        </Table.Td>
        <Table.Td>
          <Text size="sm">${(item.price || 0).toFixed(2)}</Text>
        </Table.Td>
        <Table.Td>
          <Group gap={0}>
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
  }).filter(Boolean); // Remove any null rows

  return (
    <div>
      <Group position="apart" mb="lg">
        <Title order={2}>Product List</Title>
        <Button
          color="green"
          onClick={() => {
            setModalOpen(true);
            setIsEditing(false); // Ensure it's in add mode
          }}
        >
          Add Product
        </Button>
      </Group>
      <Table striped highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Product Name</Table.Th>
            <Table.Th>Author</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Stock</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      {/* Modal for Add/Edit */}
      <Modal
        opened={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsEditing(false);
          setImagePreview(null);
          setNewProduct({
            image: null,
            productName: "",
            description: "",
            price: 0,
            stock: 0,
            category: "",
            author: "",
          });
        }}
        title={isEditing ? "Edit Product" : "Add New Product"}
      >
        <Stack spacing="sm">
          <Dropzone
            onDrop={handleImageDrop}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            style={{ marginBottom: 15 }}
          >
            <Group
              position="center"
              spacing="xl"
              style={{ minHeight: 100, pointerEvents: "none" }}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: 200 }}
                />
              ) : (
                <div style={{ textAlign: "center" }}>
                  <IconUpload size={32} stroke={1.5} />
                  <Text size="sm" mt="sm">
                    Drag an image here or click to select
                  </Text>
                </div>
              )}
            </Group>
          </Dropzone>
          <TextInput
            label="Product Name"
            placeholder="Enter product name"
            value={newProduct.productName}
            onChange={(e) =>
              setNewProduct({ ...newProduct, productName: e.target.value })
            }
          />
          <TextInput
            label="Author"
            placeholder="Enter product author"
            value={newProduct.author}
            onChange={(e) =>
              setNewProduct({ ...newProduct, author: e.target.value })
            }
          />
          <TextInput
            label="Description"
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) =>
              setNewProduct({ ...newProduct, description: e.target.value })
            }
          />
          <NumberInput
            label="Stock"
            placeholder="Enter product stock"
            value={newProduct.stock}
            onChange={(value) => setNewProduct({ ...newProduct, stock: value })}
          />
          <NumberInput
            label="Price"
            placeholder="Enter product price"
            value={newProduct.price}
            onChange={(value) => setNewProduct({ ...newProduct, price: value })}
          />

          <Select
            label="Category"
            placeholder="Enter product category"
            data={[
              { value: "category 1", label: "Category 1" },
              { value: "category 2", label: "Category 2" },
              { value: "category 3", label: "Category 3" },
            ]}
            value={newProduct.category}
            onChange={(value) =>
              setNewProduct({ ...newProduct, category: value })
            }
          />

          <Button color="blue" onClick={handleSaveProduct}>
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}
