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
} from "@mantine/core";
import { useParams } from "react-router-dom";
import axios from "axios";

const SplitLayoutBookDetails = () => {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/product/${slug}`
        );
        setBook(response.data.response);
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [slug]);

  if (loading) {
    return (
      <Container
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </Container>
    );
  }

  if (!book) {
    return (
      <Container>
        <Title order={2}>Book not found</Title>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Grid>
        <Grid.Col span={6}>
          <Image
            src={`http://localhost:3000${book.image}`}
            alt={book.productName}
            radius="md"
            fit="cover"
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <Title order={1}>{book.productName}</Title>
          <Group mb="xs">
            <Badge color="blue">{book.category}</Badge>
          </Group>
          <Text size="sm" c="dimmed" fs={"italic"}>
            {book.author}
          </Text>
          <Text size="lg" mb="md">
            {book.description}
          </Text>
          <Text size="sm" c={book.stock > 0 ? "green" : "red"}>
            Availability: {book.stock > 0 ? "In stock" : "Out of stock"}
          </Text>

          <Group mt="md" mb="md">
            <Text weight={700} size="xl" c="teal">
              ${book.price}
            </Text>
          </Group>

          <Button
            variant="filled"
            color="blue"
            size="md"
            disabled={book.stock === 0}
          >
            {book.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </Button>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default SplitLayoutBookDetails;
