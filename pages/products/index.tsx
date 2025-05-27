import { Grid, Button, Box, Dialog } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { FiFilter } from "react-icons/fi";
import { useProductsPage } from "@/hooks/useProductsPage";
import { FilterOptions } from "@/src/components/ProductsPage/FilterOptions";
import { FilterChips } from "@/src/components/ProductsPage/FilterChips";
import { ProductGrid } from "@/src/components/ProductsPage/ProductGrid";

export default function ProductsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    filteredProducts,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
    sortOption,
    setSortOption,
    category,
    setCategory,
    inStockOnly,
    setInStockOnly,
    openFilterDialog,
    setOpenFilterDialog,
    isLoading,
    error,
    handleResetFilters,
    getFilterSummary,
    categories,
    sortOptions,
  } = useProductsPage();

  return (
    <Grid container spacing={4}>
      {/* Sidebar Filters */}
      <Grid item xs={12} md={3}>
        {isMobile ? (
          <Dialog
            open={openFilterDialog}
            onClose={() => setOpenFilterDialog(false)}
          >
            <Box sx={{ width: 280 }}>
              <FilterOptions
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                category={category}
                setCategory={setCategory}
                sortOption={sortOption}
                setSortOption={setSortOption}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                handleResetFilters={handleResetFilters}
                getFilterSummary={getFilterSummary}
                categories={categories}
                sortOptions={sortOptions}
              />
            </Box>
          </Dialog>
        ) : (
          <FilterOptions
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            category={category}
            setCategory={setCategory}
            sortOption={sortOption}
            setSortOption={setSortOption}
            inStockOnly={inStockOnly}
            setInStockOnly={setInStockOnly}
            handleResetFilters={handleResetFilters}
            getFilterSummary={getFilterSummary}
            categories={categories}
            sortOptions={sortOptions}
          />
        )}
        {isMobile && (
          <Button
            variant="outlined"
            startIcon={<FiFilter />}
            onClick={() => setOpenFilterDialog(true)}
            sx={{ mt: 2 }}
          >
            Filters
          </Button>
        )}
      </Grid>

      {/* Product Display Section */}
      <Grid item xs={12} md={9}>
        <FilterChips
          getFilterSummary={getFilterSummary}
          setPriceRange={setPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setCategory={setCategory}
          setSortOption={setSortOption}
          setInStockOnly={setInStockOnly}
        />
        <ProductGrid
          filteredProducts={filteredProducts}
          isLoading={isLoading}
          error={error ? (typeof error === "string" ? error : error.message) : null}
          handleResetFilters={handleResetFilters}
        />
      </Grid>
    </Grid>
  );
}