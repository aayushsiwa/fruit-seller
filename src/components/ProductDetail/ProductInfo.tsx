import {
    Box,
    Typography,
    Button,
    Divider,
    Alert,
    TextField,
    IconButton,
} from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiShoppingCart, FiPlus, FiMinus, FiShare2 } from "react-icons/fi";
import { ProductInfoProps } from "@/types";
import { currency, defaultImage } from "@/config";

export const ProductInfo: React.FC<ProductInfoProps> = ({
    product,
    isMobile,
    cartQuantity,
    error,
    setError,
    handleAddToCart,
    handleQuantityChange,
    handleShare,
}) => {
    return (
        <>
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2 }}
                    onClose={() => setError(null)}
                >
                    {error}
                </Alert>
            )}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    gap: 4,
                }}
            >
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                    <Box
                        sx={{
                            display: "flex",
                            minHeight: 400,
                            overflow: "hidden",
                        }}
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Image
                            src={product.image || defaultImage}
                            alt={product.name}
                            width={400}
                            height={400}
                            style={{ objectFit: "cover" }}
                        />
                    </Box>
                </Box>

                <Box
                    sx={{ width: { xs: "100%", md: "50%" } }}
                    component={motion.div}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                    >
                        {product.name}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "start",
                            mb: 2,
                        }}
                    >
                        <Typography
                            variant="h5"
                            color="green"
                            sx={{ fontWeight: 700 }}
                        >
                            {currency}{" "}
                            {(product.discount
                                ? product.price * (1 - product.discount / 100)
                                : product.price
                            ).toFixed(2)}
                        </Typography>
                        {product.discount > 0 && (
                            <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ textDecoration: "line-through" }}
                            >
                                M.R.P.: {currency}
                                {product.price.toFixed(2)}
                            </Typography>
                        )}
                    </Box>

                    <Typography variant="body1" paragraph>
                        {product.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 3,
                        }}
                    >
                        <Box sx={{ minWidth: 120 }}>
                            <Typography variant="body2" color="text.secondary">
                                Category
                            </Typography>
                            <Typography variant="body1">
                                {product.category}
                            </Typography>
                        </Box>
                        <Box sx={{ minWidth: 120 }}>
                            <Typography variant="body2" color="text.secondary">
                                Availability
                            </Typography>
                            <Typography
                                variant="body1"
                                color={
                                    product.quantity > 0
                                        ? "success.main"
                                        : "error.main"
                                }
                            >
                                {product.quantity > 0
                                    ? `In Stock (${product.quantity})`
                                    : "Out of Stock"}
                            </Typography>
                        </Box>
                        <Box sx={{ minWidth: 120 }}>
                            <Typography variant="body2" color="text.secondary">
                                Seasonal
                            </Typography>
                            <Typography variant="body1">
                                {product.isSeasonal ? "Yes" : "No"}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mb: 3,
                            alignItems: "center",
                        }}
                    >
                        {cartQuantity > 0 ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: 1,
                                    flexGrow: 1,
                                }}
                                component={motion.div}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        handleQuantityChange(cartQuantity - 1)
                                    }
                                    disabled={product.quantity === 0}
                                    component={motion.div}
                                    whileHover={{ scale: 1.1 }}
                                >
                                    <FiMinus />
                                </IconButton>
                                <TextField
                                    value={cartQuantity}
                                    onChange={(e) => {
                                        const value = Number.parseInt(
                                            e.target.value
                                        );
                                        if (!isNaN(value) && value >= 0) {
                                            handleQuantityChange(value);
                                        }
                                    }}
                                    inputProps={{
                                        min: 0,
                                        max: product.quantity,
                                        style: { textAlign: "center" },
                                    }}
                                    sx={{ width: 60 }}
                                    size="small"
                                />
                                <IconButton
                                    size="small"
                                    onClick={() =>
                                        handleQuantityChange(cartQuantity + 1)
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
                                size="large"
                                startIcon={<FiShoppingCart />}
                                onClick={handleAddToCart}
                                disabled={product.quantity === 0}
                                sx={{ flexGrow: 1 }}
                                component={motion.div}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Add to Cart
                            </Button>
                        )}
                        <IconButton
                            color="primary"
                            sx={{ border: 1, borderColor: "divider" }}
                            component={motion.div}
                            whileHover={{ scale: 1.1 }}
                            onClick={handleShare}
                        >
                            <FiShare2 />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </>
    );
};
