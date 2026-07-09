import { EmptyCheckout } from '@/src/components/Checkout/EmptyCheckout';
import { OrderSummary } from '@/src/components/Checkout/OrderSummary';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
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
                  <Box sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={newAddress.country}
                      disabled
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                      required
                    />

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

                    <TextField
                      fullWidth
                      label="Mobile Number"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          phone: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                      required
                    />

                    <TextField
                      fullWidth
                      label="Pin Code"
                      value={newAddress.postal_code}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          postal_code: e.target.value,
                        })
                      }
                      sx={{ mb: 2 }}
                      variant="outlined"
                      size="small"
                      required
                    />

                    <FormControl fullWidth sx={{ mb: 2 }} size="small">
                      <Select
                        displayEmpty
                        disabled={offices.length === 0}
                        value={selectedOffice?.officeName ?? ''}
                        onChange={(e) => {
                          const office = offices.find(
                            (o) => o.officeName === e.target.value
                          );
                          handleSelectOffice(office ?? null);
                        }}
                        renderValue={(value) => {
                          if (!value) {
                            return (
                              <Typography color="text.secondary">
                                {offices.length === 0
                                  ? 'Enter Pin Code first'
                                  : 'Select Locality'}
                              </Typography>
                            );
                          }
                          return value;
                        }}
                      >
                        {offices.map((office) => (
                          <MenuItem
                            key={office.officeName}
                            value={office.officeName}
                          >
                            {office.officeName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                      <TextField
                        fullWidth
                        label="City"
                        value={newAddress.city}
                        disabled
                        variant="outlined"
                        size="small"
                        required
                      />
                      <TextField
                        fullWidth
                        label="State"
                        value={newAddress.state}
                        disabled
                        variant="outlined"
                        size="small"
                        required
                      />
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
