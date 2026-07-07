import { LoadingScreen } from '@/src/components/LoadingScreen';
import { ErrorMessage } from '@/src/components/Success/ErrorMessage';
import { OrderDetails } from '@/src/components/Success/OrderDetails';
import { Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';

import { useSuccess } from './Success.hooks';
import { useSuccessStyles } from './Success.styles';

export default function Success() {
  const classes = useSuccessStyles();
  const { order, products, isLoading, error, handleContinueShopping } =
    useSuccess();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={handleContinueShopping} />;
  }

  return (
    <Container maxWidth="lg" className={classes.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FiCheckCircle
          size={60}
          color="green"
          aria-label="Payment successful"
          className={classes.checkIcon}
        />
        <Typography
          variant="h4"
          gutterBottom
          className={classes.successMessageTitle}
        >
          Payment Successful
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          paragraph
          className={classes.successMessage}
        >
          Thank you for your purchase! You&apos;ll receive a confirmation soon.
        </Typography>

        {order && <OrderDetails order={order} products={products} />}

        <Button
          variant="contained"
          color="primary"
          onClick={handleContinueShopping}
          className={classes.continueButton}
          sx={{ mt: 4 }}
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
