import AddressForm from '@/src/components/AddressForm/AddressForm';
import { EmptyCheckout } from '@/src/components/Checkout/EmptyCheckout';
import { OrderSummary } from '@/src/components/Checkout/OrderSummary';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import {
  Box,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

import { useCheckout } from './Checkout.hooks';

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
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    newAddress,
    setNewAddress,
    saveToProfile,
    setSaveToProfile,
    shippingCost,
    offices,
    selectedOffice,
    handleSelectOffice,
  } = useCheckout();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ pt: 4, pb: 4 }}>
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
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography>Loading products...</Typography>
          </Box>
        ) : hasError ? (
          <Box>
            <Typography color="error">
              Failed to load some product details. Please try again.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4} sx={{ width: '100%' }}>
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 3, borderRadius: 1, mb: 3 }} elevation={3}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Shipping Address
                </Typography>

                {savedAddresses.length > 0 && (
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <RadioGroup
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                      {savedAddresses.map((addr) => (
                        <FormControlLabel
          key={addr.ID}
          value={addr.ID}
                          control={<Radio color="primary" />}
                          label={
                            <Box sx={{ py: 1 }}>
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {addr.street}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {addr.city}, {addr.state} - {addr.postalCode},{' '}
                                {addr.country}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                              >
                                Phone: {addr.phone}
                              </Typography>
                            </Box>
                          }
                          sx={{ mb: 1, alignItems: 'flex-start' }}
                        />
                      ))}
                      <FormControlLabel
                        value="new"
                        control={<Radio color="primary" />}
                        label={
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, py: 1 }}
                          >
                            Use a new shipping address
                          </Typography>
                        }
                        sx={{ mb: 1 }}
                      />
                    </RadioGroup>
                  </FormControl>
                )}

                {selectedAddressId === 'new' && (
                  <Box>
                    <AddressForm
                      address={newAddress}
                      onChange={setNewAddress}
                      offices={offices}
                      selectedOffice={selectedOffice}
                      onSelectOffice={handleSelectOffice}
                      showSaveCheckbox
                      saveToProfile={saveToProfile}
                      onSaveToProfileChange={setSaveToProfile}
                    />
                  </Box>
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <OrderSummary
                cart={cart}
                products={products}
                getCartTotal={getCartTotal}
                handlePayNow={handlePayNow}
                processing={processing}
                hasError={hasError}
                handleCheckout={handlePayNow}
                shippingCost={shippingCost}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Container>
  );
}
