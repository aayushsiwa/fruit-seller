import { Container, Typography, Button } from "@mui/material";
import { FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";
import { useSuccess } from "@/hooks/useSuccess";
import { OrderDetails } from "@/src/components/Success/OrderDetails";
import { LoadingScreen } from "@/src/components/LoadingScreen";
import { ErrorMessage } from "@/src/components/Success/ErrorMessage";

export default function Success() {
  const { order, products, isLoading, error, handleContinueShopping } = useSuccess();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleContinueShopping} />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8, textAlign: "center" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FiCheckCircle
          size={60}
          color="green"
          style={{ marginBottom: 16 }}
          aria-label="Payment successful"
        />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: "primary.main" }}
        >
          Payment Successful
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ maxWidth: 600, mx: "auto", mb: 4 }}
        >
          Thank you for your purchase! You&apos;ll receive a confirmation soon.
        </Typography>

        {order && <OrderDetails order={order} products={products} />}

        <Button
          variant="contained"
          color="primary"
          onClick={handleContinueShopping}
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: "none",
          }}
          component={motion.div}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Continue Shopping
        </Button>
      </motion.div>
    </Container>
  );
}