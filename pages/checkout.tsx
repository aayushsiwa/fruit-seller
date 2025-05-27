import { Container, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCheckout } from "@/hooks/useCheckout";
import { OrderSummary } from "@/src/components/Checkout/OrderSummary";
import { EmptyCheckout } from "@/src/components/Checkout/EmptyCheckout";
import { LoadingScreen } from "@/src/components/LoadingScreen";

export default function Checkout() {
    const router = useRouter();
    const {
        cart,
        products,
        isLoading,
        isLoadingProducts,
        hasError,
        processing,
        handlePayNow,
        status,
        getCartTotal,
    } = useCheckout();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 4 }}
                    component={motion.div}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Checkout
                </Typography>

                {cart.length === 0 ? (
                    <EmptyCheckout />
                ) : isLoadingProducts ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography>Loading products...</Typography>
                    </Box>
                ) : hasError ? (
                    <Box sx={{ textAlign: "center", py: 8 }}>
                        <Typography color="error">
                            Failed to load some product details. Please try
                            again.
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ maxWidth: 600, mx: "auto" }}>
                        <OrderSummary
                            cart={cart}
                            products={products}
                            getCartTotal={getCartTotal}
                            handlePayNow={handlePayNow}
                            processing={processing}
                            hasError={hasError}
                            handleCheckout={handlePayNow}
                        />
                    </Box>
                )}
            </Box>
        </Container>
    );
}
