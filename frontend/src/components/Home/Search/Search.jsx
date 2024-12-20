import { Input, Select } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import classes from "./Search.module.css";

export default function Search({ onSearch, onSort }) {
  return (
    <div className={classes.container}>
      <Input
        className={classes.inputContainer}
        radius="md"
        w="100%"
        maw={1330}
        placeholder="Search by product name or author"
        leftSection={<IconSearch size={16} style={{ marginLeft: "20px" }} />}
        onChange={(e) => onSearch(e.target.value)} // Pass input value to the parent component
      />
      <Select
        className={classes.selectContainer}
        radius="md"
        checkIconPosition="right"
        placeholder="Sort By"
        data={[
          { value: "newest", label: "Newest" },
          { value: "oldest", label: "Oldest" },
        ]}
        defaultValue="newest"
        onChange={onSort} // Pass selected sort option to parent
      />
    </div>
  );
}
