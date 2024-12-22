import {
  IconBook2,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { ActionIcon, Anchor, Group } from "@mantine/core";
import classes from "./Footer.module.css";

const links = [
  { link: "/Contact", label: "Contact" },
  { link: "/About", label: "About" },
  { link: "/Category", label: "Category" },
];

export function Footer() {
  const items = links.map((link) => (
    <Anchor
      c="dimmed"
      key={link.label}
      href={link.link}
      lh={1}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <div className={classes.inner}>
        <IconBook2 />

        <Group className={classes.links}>{items}</Group>

        <Group gap="xs" justify="flex-end" wrap="nowrap">
          <ActionIcon
            size="lg"
            variant="default"
            radius="xl"
            component="a"
            href="https://github.com/kaankaniince" // Replace with your GitHub URL
            target="_blank"
          >
            <IconBrandGithub size={18} stroke={1.5} />
          </ActionIcon>
          <ActionIcon
            size="lg"
            variant="default"
            radius="xl"
            component="a"
            href="https://www.linkedin.com/in/kaankaniince/" // Replace with your LinkedIn URL
            target="_blank"
          >
            <IconBrandLinkedin size={18} stroke={1.5} />
          </ActionIcon>
        </Group>
      </div>
    </div>
  );
}
