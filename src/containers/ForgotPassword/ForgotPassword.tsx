import {
  Alert,
  Box,
  Button,
  Container,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';

import { useForgotPassword } from './ForgotPassword.hooks';

export default function ForgotPassword() {
  const {
    formik,
    successMessage,
    errorMessage,
    demoResetLink,
    cooldown,
    isResending,
    handleResendEmail,
    isConfirmed,
  } = useForgotPassword();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{ mt: 8, mb: 8 }}
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: '16px' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{ fontWeight: 700 }}
            >
              Forgot Password?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your registered email below to receive a password reset link
            </Typography>
          </Box>

          {isConfirmed && (
            <Box>
              {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
              )}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleResendEmail}
                  disabled={cooldown > 0 || isResending}
                  sx={{ borderRadius: 2 }}
                  fullWidth
                >
                  {isResending
                    ? 'Resending...'
                    : cooldown > 0
                      ? `Resend Email in ${cooldown}s`
                      : 'Resend Email'}
                </Button>
              </Box>
            </Box>
          )}

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {demoResetLink && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 2,
                bgcolor: 'rgba(237, 108, 2, 0.08)',
                border: '1px dashed #ed6c02',
                textAlign: 'center',
              }}
              component={motion.div}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Typography
                variant="body2"
                color="warning.main"
                fontWeight={600}
                gutterBottom
              >
                [Demo Mode] Reset link generated successfully:
              </Typography>
              <Link href={demoResetLink} passHref>
                <Button
                  variant="contained"
                  color="warning"
                  size="small"
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  Go to Reset Password
                </Button>
              </Link>
            </Box>
          )}

          {!isConfirmed && (
            <form onSubmit={formik.handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  label="Email Address"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={formik.isSubmitting}
                  sx={{ borderRadius: 2 }}
                >
                  {formik.isSubmitting
                    ? 'Sending Request...'
                    : 'Send Reset Link'}
                </Button>
              </Box>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/login" passHref legacyBehavior>
              <MuiLink
                variant="body2"
                underline="hover"
                sx={{ fontWeight: 600 }}
              >
                Back to Sign In
              </MuiLink>
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
