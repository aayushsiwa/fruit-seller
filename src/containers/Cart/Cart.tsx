import { CartItems } from '@/src/components/Cart/CartItems';
import { EmptyCart } from '@/src/components/Cart/EmptyCart';
import { OrderSummary } from '@/src/components/Cart/OrderSummary';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { Box, Button, Container, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

import { useCartPage } from './Cart.hooks';
import useStyles from './Cart.styles';

export default function Cart() {
  const MotionButton = motion(Button);
  const classes = useStyles();

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
      <Box className={classes.headerBox}>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Cart
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Review your items and proceed to checkout
        </Typography>
      </Box>

      {cart.length === 0 ? (
        <EmptyCart handleContinueShopping={handleContinueShopping} />
      ) : (
        <Box className={classes.flexContainer}>
          <Box className={classes.cartBox}>
            <CartItems
              cart={cart}
              products={products}
              handleQuantityChange={handleQuantityChange}
              handleRemoveItem={handleRemoveItem}
              isLoadingProducts={isLoadingProducts}
              hasError={hasError}
            />
            <Box className={classes.buttonsWrapper}>
              <MotionButton
                variant="outlined"
                startIcon={<FiArrowLeft />}
                onClick={handleContinueShopping}
                whileHover={{ scale: 1.05 }}
              >
                Continue Shopping
              </MotionButton>

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
          <Box className={classes.summaryBox}>
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
