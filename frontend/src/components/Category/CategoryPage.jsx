import { Center, Container, Grid, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CategoryFilterPage } from "../Home/Category/CategoryFilterPage";
import Search from "../Home/Search/Search";
import { CardComponent } from "../Card/CardComponent";
import PaginationComponent from "../Home/Pagination/Pagination";

function CategoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for filters
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]); // Updated to array for multiple selections
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState(""); // New state for search
  const [currentPage, setCurrentPage] = useState(1); // Track current page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/product");
        const fetchedData = response.data.response;

        setData(fetchedData);

        const uniqueCategories = Array.from(
          new Set(fetchedData.map((item) => item.category))
        ).map((category) => ({ name: category }));

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter the data based on category, price range, and search query
  const filteredData = data.filter((item) => {
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(item.category)
      : true;
    const matchesPrice =
      item.price >= priceRange.min && item.price <= priceRange.max;
    const matchesSearch = searchQuery
      ? item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesCategory && matchesPrice && matchesSearch;
  });

  // Pagination: Slice the filtered data based on the current page
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Container
        fluid
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Loader size="xl" />
      </Container>
    );
  }

  return (
    <>
      {/* Tabs and Cards Section */}
      <Grid>
        <Grid.Col span={2}>
          <CategoryFilterPage
            category={categories}
            onCategoryChange={setSelectedCategories} // Update with multi-selection handler
            onPriceRangeChange={setPriceRange}
            selectedCategories={selectedCategories} // Pass selected categories array
            priceRange={priceRange}
          />
        </Grid.Col>

        <Grid.Col span={10}>
          <Grid>
            {/* Search */}
            <Grid.Col span={12}>
              <Search onSearch={setSearchQuery} />
            </Grid.Col>
          </Grid>

          {/* Render Cards */}
          <Grid gutter="lg">
            {paginatedData.map((item) => (
              <Grid.Col span={4} key={item.id} onClick={() => navigate(`/book/${item.slug}`)}>
                <CardComponent
                  image={`http://localhost:3000${item.image}`}
                  category={item.category}
                  author={item.author}
                  productName={item.productName}
                  description={item.description}
                  price={item.price}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Grid.Col>
      </Grid>

      <Grid>
        <Grid.Col span={12}>
          <Center mt="xs">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </Center>
        </Grid.Col>
      </Grid>
    </>
  );
}

export default CategoryPage;
