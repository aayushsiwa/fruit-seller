import {
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Typography,
    Button,
    Box,
    IconButton,
    TextField,
} from "@mui/material";
import { FiShoppingCart, FiPlus, FiMinus } from "react-icons/fi";
import { ItemType } from "@/types";
import { motion } from "framer-motion";
import { currency, defaultImage } from "@/config";
import useProductCard from "@/hooks/useProductCard";

const ProductCard = ({ product }: { product: ItemType }) => {
    const {
        isOutOfStock,
        handleAddToCart,
        handleQuantityChange,
        handleViewDetails,
        handleInputChange,
        cartQuantity,
        discountedPrice,
    } = useProductCard(product);

    return (
        <Card
            sx={{
                height: 370,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                    transform: isOutOfStock ? "none" : "translateY(-4px)",
                    boxShadow: isOutOfStock
                        ? "none"
                        : "0 12px 20px rgba(0, 0, 0, 0.1)",
                },
                cursor: isOutOfStock ? "default" : "pointer",
                position: "relative",
            }}
            onClick={handleViewDetails}
            component={motion.div}
            whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
            transition={{ duration: 0.2 }}
        >
            <CardMedia
                component="img"
                height="160"
                image={product.image || defaultImage}
                alt={product.name}
                loading="lazy"
                sx={{ objectFit: "cover" }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        noWrap
                        title={product.name}
                        sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {product.name}
                    </Typography>
                    {isOutOfStock && (
                        <Typography
                            variant="body2"
                            color="error"
                            sx={{ mt: 1, fontWeight: 500 }}
                        >
                            Out of Stock
                        </Typography>
                    )}
                </Box>

                {discountedPrice ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                        }}
                    >
                        <Typography variant="h6" color="green" fontWeight={700}>
                            {currency}
                            {discountedPrice.toFixed(2)}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: "line-through" }}
                        >
                            {currency}
                            {product.price.toFixed(2)}
                        </Typography>
                    </Box>
                ) : (
                    <Typography variant="h6" fontWeight={700}>
                        {currency}
                        {product.price.toFixed(2)}
                    </Typography>
                )}

                <Typography
                    variant="body2"
                    color="text.secondary"
                    mt={1}
                    title={product.description}
                    sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        minHeight: 40,
                    }}
                >
                    {product.description}
                </Typography>
            </CardContent>

            <CardActions sx={{ p: 2, pt: 0 }}>
                {cartQuantity > 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",
                            gap: 1,
                        }}
                        component={motion.div}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <IconButton
                            size="small"
                            onClick={(e) =>
                                handleQuantityChange(e, cartQuantity - 1)
                            }
                            disabled={isOutOfStock}
                            component={motion.div}
                            whileHover={{ scale: 1.1 }}
                        >
                            <FiMinus />
                        </IconButton>
                        <TextField
                            onClick={(e) => e.stopPropagation()}
                            value={cartQuantity}
                            onChange={(e) => {
                                handleInputChange(e);
                            }}
                            inputProps={{
                                min: 0,
                                max: product.quantity,
                                style: { textAlign: "center" },
                            }}
                            sx={{ width: 50 }}
                            size="small"
                        />
                        <IconButton
                            size="small"
                            onClick={(e) =>
                                handleQuantityChange(e, cartQuantity + 1)
                            }
                            disabled={cartQuantity >= product.quantity}
                            component={motion.div}
                            whileHover={{ scale: 1.1 }}
                        >
                            <FiPlus />
                        </IconButton>
                    </Box>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        startIcon={<FiShoppingCart />}
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        component={motion.div}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Add to Cart
                    </Button>
                )}
            </CardActions>
        </Card>
    );
};

export default ProductCard;
