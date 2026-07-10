import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { useResetPassword } from './ResetPassword.hooks';

export default function ResetPassword() {
  const {
    formik,
    showPassword,
    showConfirmPassword,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    errorMessage,
    isTokenValid,
  } = useResetPassword();

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
              Reset Password
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter your new account password below
            </Typography>
          </Box>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {isTokenValid === false ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please request a new reset link if yours is invalid or expired.
              </Typography>
              <Link href="/forgot-password" passHref>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                >
                  Request New Reset Link
                </Button>
              </Link>
            </Box>
          ) : (
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="New Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm New Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.confirmPassword &&
                      Boolean(formik.errors.confirmPassword)
                    }
                    helperText={
                      formik.touched.confirmPassword &&
                      formik.errors.confirmPassword
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={handleClickShowConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={formik.isSubmitting || isTokenValid === null}
                    sx={{ borderRadius: 2 }}
                  >
                    {formik.isSubmitting
                      ? 'Resetting Password...'
                      : 'Reset Password'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/login" passHref>
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
