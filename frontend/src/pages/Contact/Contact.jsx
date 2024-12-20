import {
  Button,
  Center,
  Container,
  SimpleGrid,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";

export default function Contact() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 2
          ? "Name must be at least 2 characters long"
          : null,
      email: (value) =>
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
          ? "Invalid email address"
          : null,
      subject: (value) =>
        value.trim().length === 0 ? "Subject is required" : null,
    },
  });

  // change axios
  return (
    <form
      onSubmit={form.onSubmit(async (values) => {
        try {
          const response = await axios.post(
            "http://host.docker.internal:3000/api/contact",
            values,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = response.data;
          if (data.error) {
            alert(data.error);
          } else {
            alert("Mesaj başarıyla gönderildi!");
            form.reset();
          }
        } catch (error) {
          console.error("Hata:", error);
          alert("Mesaj gönderilirken bir hata oluştu.");
        }
      })}
    >
      <Container>
        <Title
          order={2}
          size="h1"
          style={{ fontFamily: "Greycliff CF, var(--mantine-font-family)" }}
          fw={900}
          ta="center"
        >
          Get in touch
        </Title>

        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          mt="xl"
        >
          <TextInput
            label="Name"
            placeholder="Your name"
            name="name"
            variant="filled"
            {...form.getInputProps("name")}
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            name="email"
            variant="filled"
            {...form.getInputProps("email")}
          />
        </SimpleGrid>

        <TextInput
          label="Subject"
          placeholder="Subject"
          mt="md"
          name="subject"
          variant="filled"
          {...form.getInputProps("subject")}
        />
        <Textarea
          mt="md"
          label="Message"
          placeholder="Your message"
          maxRows={10}
          minRows={5}
          autosize
          name="message"
          variant="filled"
          {...form.getInputProps("message")}
        />

        <Center mt="xl">
          <Button type="submit" size="md">
            Send message
          </Button>
        </Center>
      </Container>
    </form>
  );
}
