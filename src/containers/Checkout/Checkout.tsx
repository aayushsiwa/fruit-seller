import { EmptyCheckout } from '@/src/components/Checkout/EmptyCheckout';
import { OrderSummary } from '@/src/components/Checkout/OrderSummary';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
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
    isAddressAutoFilled,
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
                  <FormControl
                    component="fieldset"
                    sx={{ mb: 3, width: '100%' }}
                  >
                    <FormLabel
                      component="legend"
                      sx={{ mb: 2, fontWeight: 600 }}
                    >
                      Select a Shipping Address
                    </FormLabel>
                    <RadioGroup
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                    >
                      {savedAddresses.map((addr) => (
                        <FormControlLabel
                          key={addr.id}
                          value={addr.id}
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
                                {addr.city}, {addr.state} - {addr.postal_code},{' '}
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
                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      New Shipping Address
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Postal Code (PIN Code)"
                        value={newAddress.postal_code}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postal_code: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                        required
                        helperText={
                          isAddressAutoFilled
                            ? 'City & State verified'
                            : 'Enter 6-digit PIN code to auto-fill City/State'
                        }
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                        required
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Address Line 1 (Street, Company, C/O)"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                      required
                    />

                    <TextField
                      fullWidth
                      label="Address Line 2 (Apartment, Suite, Unit, Building, Floor)"
                      value={newAddress.street2}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          street2: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                    />

                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="City"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        variant="outlined"
                        size="small"
                        required
                        disabled={isAddressAutoFilled}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        value={newAddress.state}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            state: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                        required
                        disabled={isAddressAutoFilled}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="Country"
                        value={newAddress.country}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            country: e.target.value,
                          })
                        }
                        variant="outlined"
                        size="small"
                        required
                      />
                      <Box sx={{ width: '100%' }} />
                    </Box>

                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={saveToProfile}
                          onChange={(e) => setSaveToProfile(e.target.checked)}
                          color="primary"
                        />
                      }
                      label="Save this address to my profile"
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
