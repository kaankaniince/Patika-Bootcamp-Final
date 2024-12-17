import { Input } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

export default function Search({ onSearch }) {
  return (
    <>
      <Input
        radius="md"
        w="100%"
        maw={1330}
        placeholder="Search by product name or author"
        leftSection={<IconSearch size={16} />}
        onChange={(e) => onSearch(e.target.value)} // Pass input value to the parent component
      />
    </>
  );
}
