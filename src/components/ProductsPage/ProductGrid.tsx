import { Box, Typography, Button, Grid, CircularProgress } from "@mui/material";
import ProductCard from "@/src/components/ProductCard";
import { ProductGridProps } from "@/types";

export const ProductGrid: React.FC<ProductGridProps> = ({
    filteredProducts,
    isLoading,
    error,
    handleResetFilters,
}) => {
    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 6,
                }}
            >
                <Typography variant="h6" color="red" gutterBottom>
                    Loading fresh fruits ...
                </Typography>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" textAlign="center" sx={{ py: 6 }}>
                Failed to load products. Please try again later.
            </Typography>
        );
    }

    return (
        <Grid container spacing={3}>
            {filteredProducts.length ? (
                filteredProducts.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                        <ProductCard product={product} />
                    </Grid>
                ))
            ) : (
                <Box sx={{ width: "100%", textAlign: "center", py: 6 }}>
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                    >
                        No products match your filters.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try changing your filters or search terms.
                    </Typography>
                    <Button
                        variant="text"
                        onClick={handleResetFilters}
                        sx={{ mt: 2 }}
                    >
                        Reset Filters
                    </Button>
                </Box>
            )}
        </Grid>
    );
};
