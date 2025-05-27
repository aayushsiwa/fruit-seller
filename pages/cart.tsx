import { Container, Box, Typography, Button } from "@mui/material";
import { FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";
import { useCartPage } from "@/hooks/useCartPage";
import { CartItems } from "@/src/components/Cart/CartItems";
import { OrderSummary } from "@/src/components/Cart/OrderSummary";
import { EmptyCart } from "@/src/components/Cart/EmptyCart";
import { LoadingScreen } from "@/src/components/LoadingScreen";

export default function Cart() {
  const {
    cart,
    products,
    isLoading,
    isLoadingProducts,
    hasError,
    handleQuantityChange,
    handleRemoveItem,
    handleContinueShopping,
    handleCheckout,
    getCartTotal,
    clearCart,
  } = useCartPage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Your Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your items and proceed to checkout
        </Typography>
      </Box>

      {cart.length === 0 ? (
        <EmptyCart handleContinueShopping={handleContinueShopping} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          <Box sx={{ width: { xs: "100%", md: "65%" } }}>
            <CartItems
              cart={cart}
              products={products}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              isLoadingProducts={isLoadingProducts}
              hasError={hasError}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Button
                variant="outlined"
                startIcon={<FiArrowLeft />}
                onClick={handleContinueShopping}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={clearCart}
                component={motion.div}
                whileHover={{ scale: 1.05 }}
              >
                Clear Cart
              </Button>
            </Box>
          </Box>
          <Box sx={{ width: { xs: "100%", md: "30%" } }}>
            <OrderSummary
              cart={cart}
              products={products}
              getCartTotal={getCartTotal}
              handleCheckout={handleCheckout}
              handlePayNow={handleCheckout}
              processing={isLoadingProducts}
              hasError={hasError}
              disabled={isLoadingProducts || hasError || cart.length === 0}
            />
          </Box>
        </Box>
      )}
    </Container>
  );
}