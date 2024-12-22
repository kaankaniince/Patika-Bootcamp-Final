import cx from 'clsx';
import { Container, Overlay, Text, Title } from '@mantine/core';
import classes from './ImageBackground.module.css';

export function ImageBackground() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Welcome to Our Book-Shop
        </Title>

        <Container size={640}>
          <Text size="lg" className={classes.description}>
            Discover a world of books at your fingertips. Build your perfect library with us.
          </Text>
        </Container>
      </div>
    </div>
  );
}
