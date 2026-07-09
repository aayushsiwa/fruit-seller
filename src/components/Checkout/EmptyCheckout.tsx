import { Box, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FiCreditCard } from 'react-icons/fi';

export const EmptyCheckout: React.FC = () => {
  return (
    <Box
      data-testid="empty-checkout"
      sx={{ textAlign: 'center', py: 8 }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <FiCreditCard size={60} style={{ marginBottom: 16, opacity: 0.3 }} />
      <Typography variant="h5" gutterBottom>
        Your cart is empty
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/products"
        sx={{ mt: 2 }}
        component={motion.div}
        whileHover={{ scale: 1.05 }}
      >
        Shop Now
      </Button>
    </Box>
  );
};
