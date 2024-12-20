import { useAuth } from "../../store/AuthContext";
import axios from "axios";
import {
  Card,
  Group,
  Image,
  Text,
  Badge,
  Button,
} from "@mantine/core";
import classes from "./CardComponent.module.css";
import { showNotification } from '@mantine/notifications';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

export function CardComponent({
  image,
  category,
  productName,
  description,
  price,
  author,
  stock,
  slug,
}) {
  const { user, isAuthenticated } = useAuth();
  const [addedToCart, setAddedToCart] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      alert("Please login to add items to your cart");
      return;
    }

    const product = {
      productId: slug,
      productName,
      price,
      category,
      author,
      image,
      description,
      slug,
      stock,
    };

    const userId = user?.userId;

    try {
      await axios.post("http://localhost:3000/api/basket", {
        userId: userId,
        product: product,
      });

      showNotification({
        title: 'Success',
        message: 'Product added to cart successfully!',
        color: 'teal',
      });

      setAddedToCart(true); // Sepete eklendiği bilgisini tut
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart.");
    }
  };

  const handleSeeInCart = (e) => {
    e.stopPropagation();
    navigate("/Cart");
  };

  const isOutOfStock = stock === 0;

  return (
    <Card
      shadow="lg"
      padding="xl"
      radius="md"
      className={classes.card}
      mt={"xs"}
    >
      <Card.Section>
        <Image
          src={image}
          height={200}
          alt={productName}
          className={classes.cardImage}
          fit="contain"
        />
      </Card.Section>

      <Group position="apart" className={classes.cardHeader}>
        <Text weight={600} size="lg" className={classes.productName} lineClamp={1}>
          {productName}
        </Text>
        <Badge color="teal" variant="filled" className={classes.category}>
          {category}
        </Badge>
      </Group>

      <Text size="sm" c="gray" className={classes.author}>
        {author}
      </Text>

      <Text size="sm" lineClamp={2} className={classes.description}>
        {description}
      </Text>

      <Text
        size="sm"
        weight={500}
        style={{ color: isOutOfStock ? "red" : "green", marginTop: "0.5rem" }}
      >
        {isOutOfStock ? "Out of stock" : "In stock"}
      </Text>

      <Text weight={500} size="lg" c="teal" className={classes.cardFooter}>
        ${price}
      </Text>

      {!addedToCart ? (
        <Button
          variant="outline"
          color="teal"
          fullWidth
          className={classes.buyButton}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          Add to Cart
        </Button>
      ) : (
        <Button
          variant="outline"
          color="blue"
          fullWidth
          className={classes.buyButton}
          onClick={handleSeeInCart}
        >
          See in Cart
        </Button>
      )}
    </Card>
  );
}
