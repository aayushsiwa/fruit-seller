import { Container, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useCheckout } from "@/hooks/useCheckout";
import { OrderSummary } from "@/src/components/Checkout/OrderSummary";
import { EmptyCheckout } from "@/src/components/Checkout/EmptyCheckout";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { useCheckoutStyles } from "./styles";

export default function Checkout() {
    const router = useRouter();
    const classes = useCheckoutStyles();
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
            <Box className={classes.root}>
                <Typography
                    variant="h4"
                    gutterBottom
                    className={classes.title}
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
                    <Box className={classes.loadingBox}>
                        <Typography>Loading products...</Typography>
                    </Box>
                ) : hasError ? (
                    <Box className={classes.errorText}>
                        <Typography color="error">
                            Failed to load some product details. Please try
                            again.
                        </Typography>
                    </Box>
                ) : (
                    <Box className={classes.summaryBox}>
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
