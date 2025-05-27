import { Box, Typography, Button } from "@mui/material";
import { FiShoppingCart } from "react-icons/fi";
import { motion } from "framer-motion";
import { EmptyCartProps } from "@/types";

export const EmptyCart: React.FC<EmptyCartProps> = ({
    handleContinueShopping,
}) => {
    return (
        <Box
            sx={{ textAlign: "center", py: 8 }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <FiShoppingCart
                size={60}
                style={{ marginBottom: 16, opacity: 0.3 }}
            />
            <Typography variant="h5" gutterBottom>
                Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
                Looks like you haven&apos;t added any products to your cart yet.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleContinueShopping}
                sx={{ mt: 2 }}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
            >
                Start Shopping
            </Button>
        </Box>
    );
};
