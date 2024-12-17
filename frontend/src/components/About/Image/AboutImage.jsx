import cx from "clsx";
import { Overlay, Title } from "@mantine/core";
import classes from "./AboutImage.module.css";

export function AboutImage() {
  return (
    <div className={classes.wrapper}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Title className={classes.title}>
          Everything You Need To Know About Us
        </Title>
      </div>
    </div>
  );
}
