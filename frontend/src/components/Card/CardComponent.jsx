import {
  ActionIcon,
  Card,
  Group,
  Image,
  Text,
  Badge,
  Button,
} from "@mantine/core";
import classes from "./CardComponent.module.css";

export function CardComponent({
  image,
  category,
  productName,
  description,
  price,
  author,
}) {
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
        <Text weight={600} size="lg" className={classes.productName}>
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

      <Text weight={500} size="lg" c="teal" className={classes.cardFooter}>
        ${price}
      </Text>

      <Button
        variant="outline"
        color="teal"
        fullWidth
        className={classes.buyButton}
      >
        Add to Cart
      </Button>
    </Card>
  );
}
