import React, { useEffect, useState } from "react";
import {
  Container,
  Image,
  Text,
  Title,
  Badge,
  Group,
  Button,
  Loader,
  Grid,
  Paper,
  Notification,
  Divider,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../store/AuthContext";

const BookDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [inCart, setInCart] = useState(false); // Tracks if the product is in the cart
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/${slug}`
        );
        setBook(response.data.response);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  const handleAddToCart = async () => {
  if (!isAuthenticated) {
    // Show error notification and do nothing further
    setError("Please log in to add items to your cart.");
    setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
    return; // Stop further execution
  }

  const product = {
    productId: book.slug,
    productName: book.productName,
    price: book.price,
    category: book.category,
    author: book.author,
    image: `http://localhost:3000${book.image}`, // Ensure the image URL is absolute
    description: book.description,
  };

  try {
    await axios.post("http://localhost:3000/api/basket", {
      userId: user?.userId,
      product,
    });
    setCartSuccess(true);
    setInCart(true); // Mark as added to cart
    setTimeout(() => setCartSuccess(false), 1000);
  } catch (err) {
    console.error("Failed to add product to cart:", err);
    setError("Failed to add product to cart. Please try again.");
  }
};


  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Loader size="xl" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container mt="xl">
        <Notification icon={<IconX size={18} />} color="red" title="Error" disallowClose>
          {error}
        </Notification>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container mt="xl">
        <Title align="center" order={2}>
          Book not found
        </Title>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Grid gutter="xl" align="center">
        <Grid.Col xs={12} md={5}>
          <Paper shadow="sm" radius="md" p="md" withBorder>
            <Image
              src={`http://localhost:3000${book.image}`}
              alt={book.productName}
              radius="md"
              fit="contain"
              height={400}
              placeholder={<Loader />}
            />
          </Paper>
        </Grid.Col>
        <Grid.Col xs={12} md={7}>
          <Title order={1} mb="sm" align="left">
            {book.productName}
          </Title>
          <Group spacing="xs" mb="sm">
            <Badge color="blue" variant="filled">
              {book.category}
            </Badge>
            {book.stock > 0 ? (
              <Badge color="green" variant="light">
                In Stock
              </Badge>
            ) : (
              <Badge color="red" variant="light">
                Out of Stock
              </Badge>
            )}
          </Group>
          <Text size="md" c="dimmed" fs="italic" mb="sm">
            by {book.author}
          </Text>
          <Divider my="sm" />
          <Text size="sm" mb="md" align="justify">
            {book.description}
          </Text>
          <Divider my="sm" />
          <Group position="apart" mt="md" mb="md">
            <Text weight={700} size="xl" c="teal">
              ${book.price.toFixed(2)}
            </Text>
            <Text size="sm" c={book.stock > 0 ? "green" : "red"}>
              Availability: {book.stock > 0 ? "In stock" : "Out of stock"}
            </Text>
          </Group>

          {inCart ? (
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 45 }}
              size="md"
              fullWidth
              onClick={() => navigate("/cart")}
            >
              See in Cart
            </Button>
          ) : (
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "blue", deg: 45 }}
              size="md"
              fullWidth
              disabled={book.stock === 0}
              onClick={handleAddToCart}
            >
              {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </Button>
          )}

          {cartSuccess && (
            <Notification
              icon={<IconCheck size={18} />}
              color="teal"
              title="Success"
              onClose={() => setCartSuccess(false)}
              mt="md"
            >
              Product added to cart!
            </Notification>
          )}
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default BookDetails;
