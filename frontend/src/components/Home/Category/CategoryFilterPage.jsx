import { Box, Checkbox, Stack, Text, Button, Group, NumberInput } from "@mantine/core";

export function CategoryFilterPage({
  category, // Passed category array
  onCategoryChange,
  onPriceRangeChange,
  selectedCategories, // Assuming this is an array for multiple selected categories
  priceRange,
}) {
  const { min, max } = priceRange;

  const handleApplyPriceRange = () => {
    onPriceRangeChange({ min, max });
  };

  const handleCategoryChange = (selected) => {
    onCategoryChange(selected); // Pass the updated selected categories array
  };

  return (
    <Box
      p="md"
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        maxWidth: 300,
        backgroundColor: "#fff",
      }}
    >
      {/* Category Section */}
      <Text size="lg" weight={700} mb="sm" style={{ fontFamily: "serif" }}>
        Category
      </Text>
      <Checkbox.Group
        value={selectedCategories}
        onChange={handleCategoryChange}
        orientation="vertical"
      >
        <Stack spacing="xs">
          {category.map((cat, index) => (
            <Checkbox
              key={index}
              value={cat.name} // Assuming category objects have a 'name' field
              label={cat.name}
              styles={{
                label: { fontWeight: 500, fontSize: "16px", color: "#333" },
                input: {
                  border: "1px solid #e0e0e0",
                  "&:checked": { backgroundColor: "#000" },
                },
              }}
            />
          ))}
        </Stack>
      </Checkbox.Group>

      {/* Price Filter Section */}
      <Text size="lg" weight={700} mt="md" mb="sm" style={{ fontFamily: "serif" }}>
        Filter by Price
      </Text>
      <Group spacing="xs" grow>
        <NumberInput
          value={min}
          onChange={(value) => onPriceRangeChange({ min: value, max })}
          placeholder="Min"
          min={0}
          step={5}
          styles={{ input: { fontSize: "14px" } }}
        />
        <NumberInput
          value={max}
          onChange={(value) => onPriceRangeChange({ min, max: value })}
          placeholder="Max"
          min={min}
          step={5}
          styles={{ input: { fontSize: "14px" } }}
        />
      </Group>
      <Button
        mt="sm"
        fullWidth
        onClick={handleApplyPriceRange}
        style={{ backgroundColor: "#000", color: "#fff" }}
      >
        Apply Price Range
      </Button>
    </Box>
  );
}
