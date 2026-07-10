import AddressForm from '@/src/components/AddressForm/AddressForm';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiEye, FiEyeOff, FiPlus, FiUser } from 'react-icons/fi';

import { useProfilePage } from './Profile.hooks';

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function getInitials(firstName?: string, lastName?: string): string {
  return (
    `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase() ||
    '?'
  );
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 50%, 45%)`;
}

export default function Profile() {
  const {
    user,
    isLoading,
    error,
    profileFormik,
    isProfileSubmitting,
    passwordFormik,
    isPasswordSubmitting,
    savedAddresses,
    addressDialogOpen,
    setAddressDialogOpen,
    newAddress,
    setNewAddress,
    offices,
    selectedOffice,
    handleSelectOffice,
    handleSaveAddress,
    handleNavigation,
  } = useProfilePage();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error || !user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FiUser size={48} />
          <Typography variant="h6" color="error" gutterBottom sx={{ mt: 2 }}>
            {error || 'Unable to load profile'}
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleNavigation('/products')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div initial="initial" animate="animate" variants={stagger}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
          My Profile
        </Typography>

        <motion.div variants={fadeUp}>
          <Paper
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Avatar
              sx={{
                width: 72,
                height: 72,
                bgcolor: stringToColor(user.email),
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              {getInitials(user.firstName, user.lastName)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Box
                sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}
              >
                <Chip
                  label={user.role}
                  size="small"
                  color={user.role === 'admin' ? 'error' : 'primary'}
                  variant="outlined"
                />
                <Typography variant="caption" color="text.secondary">
                  Member since {dayjs(user.createdAt).format('MMM D, YYYY')}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Personal Information
            </Typography>
            <form onSubmit={profileFormik.handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="firstName"
                    name="firstName"
                    label="First Name"
                    value={profileFormik.values.firstName}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    error={
                      profileFormik.touched.firstName &&
                      Boolean(profileFormik.errors.firstName)
                    }
                    helperText={
                      profileFormik.touched.firstName &&
                      profileFormik.errors.firstName
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="lastName"
                    name="lastName"
                    label="Last Name"
                    value={profileFormik.values.lastName}
                    onChange={profileFormik.handleChange}
                    onBlur={profileFormik.handleBlur}
                    error={
                      profileFormik.touched.lastName &&
                      Boolean(profileFormik.errors.lastName)
                    }
                    helperText={
                      profileFormik.touched.lastName &&
                      profileFormik.errors.lastName
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    label="Email"
                    value={user.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isProfileSubmitting || !profileFormik.dirty}
                    >
                      {isProfileSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => profileFormik.resetForm()}
                      disabled={!profileFormik.dirty}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Saved Addresses
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FiPlus />}
                onClick={() => setAddressDialogOpen(true)}
              >
                Add Address
              </Button>
            </Box>

            {savedAddresses.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ py: 2, textAlign: 'center' }}
              >
                No saved addresses yet
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {savedAddresses.map((addr) => (
                  <Grid item xs={12} sm={6} key={addr.id}>
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {addr.street}
                      </Typography>
                      {addr.street2 && (
                        <Typography variant="body2" color="text.secondary">
                          {addr.street2}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        {addr.city}, {addr.state} - {addr.postal_code}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {addr.country}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Phone: {addr.phone}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Paper>
        </motion.div>

        <motion.div variants={fadeUp}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Change Password
            </Typography>
            <form onSubmit={passwordFormik.handleSubmit}>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    type={showCurrent ? 'text' : 'password'}
                    value={passwordFormik.values.currentPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={
                      passwordFormik.touched.currentPassword &&
                      Boolean(passwordFormik.errors.currentPassword)
                    }
                    helperText={
                      passwordFormik.touched.currentPassword &&
                      passwordFormik.errors.currentPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowCurrent(!showCurrent)}
                            edge="end"
                          >
                            {showCurrent ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    type={showNew ? 'text' : 'password'}
                    value={passwordFormik.values.newPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={
                      passwordFormik.touched.newPassword &&
                      Boolean(passwordFormik.errors.newPassword)
                    }
                    helperText={
                      passwordFormik.touched.newPassword &&
                      passwordFormik.errors.newPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNew(!showNew)}
                            edge="end"
                          >
                            {showNew ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    type={showConfirm ? 'text' : 'password'}
                    value={passwordFormik.values.confirmNewPassword}
                    onChange={passwordFormik.handleChange}
                    onBlur={passwordFormik.handleBlur}
                    error={
                      passwordFormik.touched.confirmNewPassword &&
                      Boolean(passwordFormik.errors.confirmNewPassword)
                    }
                    helperText={
                      passwordFormik.touched.confirmNewPassword &&
                      passwordFormik.errors.confirmNewPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirm(!showConfirm)}
                            edge="end"
                          >
                            {showConfirm ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isPasswordSubmitting}
                  >
                    {isPasswordSubmitting ? 'Updating...' : 'Update Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </motion.div>
      </motion.div>

      <Dialog 
        open={addressDialogOpen}
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent>
          <AddressForm
            address={newAddress}
            onChange={(addr) => setNewAddress(addr)}
            offices={offices}
            selectedOffice={selectedOffice}
            onSelectOffice={handleSelectOffice}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddressDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAddress}>
            Save Address
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
