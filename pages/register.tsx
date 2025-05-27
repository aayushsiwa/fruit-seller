import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Link as MuiLink,
    Paper,
    Divider,
    IconButton,
    InputAdornment,
    Checkbox,
    FormControlLabel,
    CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { TbBrandGoogle } from "react-icons/tb";
import useRegister from "@/hooks/useRegister";

export default function Register() {
    const {
        formik,
        showPassword,
        handleClickShowPassword,
        handleGoogleSignIn,
        isLoading,
        isGoogleLoading,
    } = useRegister();

    return (
        <Container maxWidth="sm">
            <Box sx={{ my: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            sx={{ fontWeight: 700 }}
                        >
                            Create an Account
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Join us to start shopping for fresh fruits
                        </Typography>
                    </Box>

                    <form onSubmit={formik.handleSubmit} noValidate>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="firstName"
                                    name="firstName"
                                    label="First Name"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.firstName &&
                                        Boolean(formik.errors.firstName)
                                    }
                                    helperText={
                                        formik.touched.firstName &&
                                        formik.errors.firstName
                                    }
                                    autoComplete="given-name"
                                    aria-required="true"
                                    disabled={isLoading}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    id="lastName"
                                    name="lastName"
                                    label="Last Name"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.lastName &&
                                        Boolean(formik.errors.lastName)
                                    }
                                    helperText={
                                        formik.touched.lastName &&
                                        formik.errors.lastName
                                    }
                                    autoComplete="family-name"
                                    aria-required="true"
                                    disabled={isLoading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="email"
                                    name="email"
                                    label="Email Address"
                                    value={formik.values.email}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.email &&
                                        Boolean(formik.errors.email)
                                    }
                                    helperText={
                                        formik.touched.email &&
                                        formik.errors.email
                                    }
                                    autoComplete="email"
                                    aria-required="true"
                                    disabled={isLoading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    id="password"
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={formik.values.password}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={
                                        formik.touched.password &&
                                        Boolean(formik.errors.password)
                                    }
                                    helperText={
                                        formik.touched.password &&
                                        formik.errors.password
                                    }
                                    autoComplete="new-password"
                                    aria-required="true"
                                    disabled={isLoading}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="Toggle password visibility"
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                    edge="end"
                                                    disabled={isLoading}
                                                >
                                                    {showPassword ? (
                                                        <FiEyeOff />
                                                    ) : (
                                                        <FiEye />
                                                    )}
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
                                    label="Confirm Password"
                                    type={showPassword ? "text" : "password"}
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
                                    autoComplete="new-password"
                                    aria-required="true"
                                    disabled={isLoading}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            id="agreeTerms"
                                            name="agreeTerms"
                                            checked={formik.values.agreeTerms}
                                            onChange={formik.handleChange}
                                            color="primary"
                                            disabled={isLoading}
                                            inputProps={{
                                                "aria-label":
                                                    "Agree to terms and conditions",
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography variant="body2">
                                            I agree to the{" "}
                                            <Link href="/terms" passHref>
                                                <MuiLink underline="hover">
                                                    Terms of Service
                                                </MuiLink>
                                            </Link>{" "}
                                            and{" "}
                                            <Link href="/privacy" passHref>
                                                <MuiLink underline="hover">
                                                    Privacy Policy
                                                </MuiLink>
                                            </Link>
                                        </Typography>
                                    }
                                />
                                {formik.touched.agreeTerms &&
                                    formik.errors.agreeTerms && (
                                        <Typography
                                            variant="caption"
                                            color="error"
                                            role="alert"
                                        >
                                            {formik.errors.agreeTerms}
                                        </Typography>
                                    )}
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={formik.isSubmitting || isLoading}
                                    aria-label="Create account"
                                >
                                    {isLoading ? (
                                        <CircularProgress size={24} />
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Box sx={{ mt: 3, textAlign: "center" }}>
                        <Typography variant="body2">
                            Already have an account?{" "}
                            <Link href="/login" passHref>
                                <MuiLink
                                    variant="body2"
                                    underline="hover"
                                    sx={{ fontWeight: 600 }}
                                    aria-label="Sign in"
                                >
                                    Sign in
                                </MuiLink>
                            </Link>
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            startIcon={<TbBrandGoogle />}
                            sx={{ flex: 1 }}
                            onClick={handleGoogleSignIn}
                            disabled={isGoogleLoading}
                            aria-label="Sign in with Google"
                        >
                            {isGoogleLoading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "Google"
                            )}
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
