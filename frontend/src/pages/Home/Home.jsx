import { Center, Container, Grid, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CardComponent } from "../../components/Card/CardComponent";
import { ImageBackground } from "../../components/Home/Image/ImageBackground";
import { CategoryFilterPage } from "../../components/Home/Category/CategoryFilterPage";
import Search from "../../components/Home/Search/Search";
import PaginationComponent from "../../components/Home/Pagination/Pagination";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for filters
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest"); // New state for sort order
  const [currentPage, setCurrentPage] = useState(1);

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

  // Filter and sort the data
  const filteredData = data
    .filter((item) => {
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
    })
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  // Pagination logic
  const itemsPerPage = 6;
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
      {/* Image Section */}
      <Grid style={{ marginBottom: "20px" }}>
        <Grid.Col span={12}>
          <ImageBackground />
        </Grid.Col>
      </Grid>

      {/* Tabs and Cards Section */}
      <Grid>
        <Grid.Col span={2}>
          <CategoryFilterPage
            category={categories}
            onCategoryChange={setSelectedCategories}
            onPriceRangeChange={setPriceRange}
            selectedCategories={selectedCategories}
            priceRange={priceRange}
          />
        </Grid.Col>

        <Grid.Col span={10}>
          <Grid>
            {/* Search */}
            <Grid.Col span={12}>
              <Search
                onSearch={setSearchQuery}
                onSort={setSortOrder} // Pass sort handler
              />
            </Grid.Col>
          </Grid>

          {/* Render Cards */}
          <Grid gutter="lg">
            {paginatedData.map((item) => (
              <Grid.Col
                span={4}
                key={item.id || item.slug}
                onClick={() => navigate(`/book/${item.slug}`)}
              >
                <CardComponent
                  image={`http://localhost:3000${item.image}`}
                  category={item.category}
                  author={item.author}
                  productName={item.productName}
                  description={item.description}
                  price={item.price}
                  stock={item.stock}
                  slug={item.slug}
                  id={item._id}
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

export default Home;
