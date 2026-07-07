import { Container, Typography, Button, Box } from "@mui/material";
import { FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { useOrderDetailPage } from "./OrderDetail.hooks";
import { OrderDetailsEnhanced } from "@/src/components/OrderDetail/OrderDetailsEnhanced";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { ErrorMessage } from "@/src/components/Success/ErrorMessage";

export default function OrderDetailPage() {
    const { order, products, isLoading, error, handleBackToOrders } =
        useOrderDetailPage();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <ErrorMessage message={error} onRetry={handleBackToOrders} />
        );
    }

    return (
        <Container maxWidth="lg" sx={{ textAlign: "center", mt: 8 }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Box sx={{ textAlign: "left", mb: 2 }}>
                    <Button
                        startIcon={<FiArrowLeft />}
                        onClick={handleBackToOrders}
                        sx={{ textTransform: "none" }}
                    >
                        Back to Orders
                    </Button>
                </Box>

                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Order Details
                </Typography>

                {order && <OrderDetailsEnhanced order={order} products={products} />}
            </motion.div>
        </Container>
    );
}
