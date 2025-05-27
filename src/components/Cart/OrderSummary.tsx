import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Divider,
    Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import { OrderSummaryProps } from "@/types";
import { currency, paymentMethods } from "@/config";

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    products,
    getCartTotal,
    handleCheckout,
    disabled,
}) => {
    const subtotal = getCartTotal(products);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Order Summary
                </Typography>
                <Box sx={{ my: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2">Subtotal</Typography>
                        <Typography variant="body2">
                            {currency}
                            {subtotal.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2">Shipping</Typography>
                        <Typography variant="body2">{currency}0.00</Typography>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body2">Tax (10%)</Typography>
                        <Typography variant="body2">
                            {currency}
                            {tax.toFixed(2)}
                        </Typography>
                    </Box>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                    }}
                >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Total
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{ fontWeight: 700 }}
                    >
                        {currency}
                        {total.toFixed(2)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    startIcon={<FiShoppingCart />}
                    onClick={handleCheckout}
                    disabled={disabled}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Proceed to Checkout
                </Button>
                <Box sx={{ mt: 3 }}>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                    >
                        We accept:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                        {paymentMethods.map((method) => (
                            <Chip
                                key={method}
                                label={method}
                                size="small"
                                variant="outlined"
                            />
                        ))}
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};
