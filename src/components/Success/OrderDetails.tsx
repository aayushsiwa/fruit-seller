import { Box, Typography, Divider, Paper } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { OrderDetailsProps, CartItem } from "@/types";
import { currency, defaultImage } from "@/config";

export const OrderDetails: React.FC<OrderDetailsProps> = ({
    order,
    products,
}) => {
    return (
        <Paper
            elevation={3}
            sx={{ p: 3, borderRadius: 2, maxWidth: 600, mx: "auto", mt: 4 }}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Details (ID: {order.id})
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr" },
                    gap: 2,
                }}
            >
                {order.items.map((item: CartItem, index: number) => {
                    const product = products[index];
                    if (!product) return null;
                    const price = product.discount
                        ? product.price * (1 - product.discount / 100)
                        : product.price;
                    return (
                        <Box
                            key={item.id}
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: "divider",
                                borderRadius: 1,
                                bgcolor: "background.paper",
                            }}
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Image
                                    src={product.image || defaultImage}
                                    alt={product.name}
                                    width={60}
                                    height={60}
                                    style={{
                                        objectFit: "cover",
                                        borderRadius: 4,
                                        marginRight: 16,
                                    }}
                                />
                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="subtitle2">
                                        {product.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Qty: {item.quantity}
                                    </Typography>
                                    {product.discount > 0 && (
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Discount: {product.discount}% (Now{" "}
                                            {currency}
                                            {price.toFixed(2)} each)
                                        </Typography>
                                    )}
                                </Box>
                                <Typography variant="subtitle2">
                                    {currency}
                                    {(price * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Total
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                >
                    {currency}
                    {order.total.toFixed(2)}
                </Typography>
            </Box>
        </Paper>
    );
};
