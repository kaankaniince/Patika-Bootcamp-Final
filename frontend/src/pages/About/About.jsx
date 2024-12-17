import { Container } from "@mantine/core";
import { AboutImage } from "../../components/About/Image/AboutImage";

function About() {
  return (
    <>
      <Container>
        <AboutImage />
        <h2>Our Story</h2>
        <p>
          Founded in 2021, Kaan Bookstore started with a simple idea: to connect
          book lovers with their next great read. From bestsellers to hidden
          gems, we strive to curate a collection that inspires and delights
          readers of all ages.
        </p>
        <h2>Our Mission</h2>
        <p>
          At Kaan Bookstore, we believe in the power of books to transform
          lives. Whether you're looking for knowledge, escapism, or a new
          perspective, our mission is to help you find the perfect book.
        </p>
      </Container>
    </>
  );
}

export default About;
