import React from "react";
import {
    Box,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
    CircularProgress,
    IconButton,
    Chip,
} from "@mui/material";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { ItemType, ProductsTabProps } from "@/types";

const ProductsTab: React.FC<ProductsTabProps> = ({
    products,
    isLoading,
    error,
    searchQuery,
    onSearchChange,
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
}) => {
    const filteredProducts = products?.filter(
        (product: ItemType) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                }}
            >
                <TextField
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    sx={{ flexGrow: 1, maxWidth: { sm: 300 } }}
                    size="small"
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<FiPlus />}
                    onClick={onAddProduct}
                >
                    Add Product
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <CircularProgress />
                                    <Typography>Loading products...</Typography>
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography color="error">
                                        Failed to load products: {error}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (filteredProducts?.length ?? 0) > 0 ? (
                            (filteredProducts ?? []).map(
                                (product: ItemType) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Box
                                                component="img"
                                                src={product.image}
                                                alt={product.name}
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    objectFit: "cover",
                                                    borderRadius: 1,
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="subtitle2">
                                                {product.name}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                noWrap
                                                sx={{ maxWidth: 200 }}
                                            >
                                                {product.description}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {product.category}
                                        </TableCell>
                                        <TableCell align="right">
                                            ${product.price.toFixed(2)}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={
                                                    product.quantity > 0
                                                        ? "In Stock"
                                                        : "Out of Stock"
                                                }
                                                color={
                                                    product.quantity > 0
                                                        ? "success"
                                                        : "error"
                                                }
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                color="primary"
                                                onClick={() =>
                                                    onEditProduct(product)
                                                }
                                                size="small"
                                            >
                                                <FiEdit2 />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() =>
                                                    onDeleteProduct(product)
                                                }
                                                size="small"
                                            >
                                                <FiTrash2 />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No products found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProductsTab;
