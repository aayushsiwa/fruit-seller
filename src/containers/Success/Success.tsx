import { LoadingScreen } from '@/src/components/LoadingScreen';
import { ErrorMessage } from '@/src/components/Success/ErrorMessage';
import { OrderDetails } from '@/src/components/Success/OrderDetails';
import { Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

import { useSuccess } from './Success.hooks';

export default function Success() {
  const { order, isLoading, error, handleContinueShopping } = useSuccess();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleContinueShopping} />;
  }

  return (
    <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 8 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FiCheckCircle
          size={60}
          color="green"
          aria-label="Payment successful"
          style={{ marginBottom: 16 }}
        />
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 700, color: 'primary.main' }}
        >
          Payment Successful
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          sx={{ mx: 'auto', mb: 4, display: 'flex', justifyContent: 'center' }}
        >
          Thank you for your purchase! You&apos;ll receive a confirmation soon.
        </Typography>

        {order && <OrderDetails order={order} />}

        <Button
          variant="contained"
          color="primary"
          onClick={handleContinueShopping}
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: 600,
            borderRadius: 2,
            textTransform: 'none',
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
