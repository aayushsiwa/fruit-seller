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
} from "@mui/material";
import Link from "next/link";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { TbBrandGoogle } from "react-icons/tb";
import useLogin from "@/hooks/useLogin";
import { useLoginStyles } from "./styles";

export default function Login() {
    const classes = useLoginStyles();
    const {
        formik,
        showPassword,
        handleClickShowPassword,
        handleGoogleSignIn,
        isLoading,
    } = useLogin();

    if (isLoading) {
        return (
            <Container maxWidth="sm">
                <Box className={classes.loadingBox}>
                    <Typography>Loading...</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box className={classes.container}>
                <Paper elevation={3} className={classes.paper}>
                    <Box className={classes.welcomeBox}>
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            className={classes.title}
                        >
                            Welcome Back
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Sign in to your account to continue
                        </Typography>
                    </Box>

                    <form onSubmit={formik.handleSubmit}>
                        <Grid container spacing={3}>
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
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={
                                                        handleClickShowPassword
                                                    }
                                                    edge="end"
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
                                <Box className={classes.forgotPasswordBox}>
                                    <Link href="/forgot-password" passHref>
                                        <MuiLink
                                            variant="body2"
                                            underline="hover"
                                        >
                                            Forgot password?
                                        </MuiLink>
                                    </Link>
                                </Box>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    disabled={formik.isSubmitting}
                                >
                                    {formik.isSubmitting
                                        ? "Signing in..."
                                        : "Sign In"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                    <Box className={classes.signUpBox}>
                        <Typography variant="body2">
                            Don&apos;t have an account?{" "}
                            <Link href="/register" passHref>
                                <MuiLink
                                    variant="body2"
                                    underline="hover"
                                    className={classes.signUpLink}
                                >
                                    Sign up
                                </MuiLink>
                            </Link>
                        </Typography>
                    </Box>

                    <Divider className={classes.divider}>
                        <Typography variant="body2" color="text.secondary">
                            OR
                        </Typography>
                    </Divider>

                    <Box className={classes.googleButtonBox}>
                        <Button
                            variant="outlined"
                            startIcon={<TbBrandGoogle />}
                            fullWidth
                            onClick={handleGoogleSignIn}
                        >
                            Sign in with Google
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
