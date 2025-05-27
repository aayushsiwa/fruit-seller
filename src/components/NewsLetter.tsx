import React from "react";
import {
    Grid,
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import { FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import { Formik, Form, Field, FieldProps } from "formik";
import { NewsletterSchema } from "@/lib/validation/newsletterSchema";
import useNewsletter from "@/hooks/useNewsletter";

export default function Newsletter() {
    const { newsletterStatus, handleNewsletterSubmit } = useNewsletter();

    return (
        <Grid>
            <Container>
                <Box
                    sx={{
                        textAlign: "center",
                        bgcolor: "primary.light",
                        borderRadius: 2,
                        p: { xs: 4, md: 6 },
                    }}
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                >
                    <Typography
                        variant="h4"
                        component="h2"
                        color="white"
                        gutterBottom
                        sx={{ fontWeight: 600 }}
                    >
                        Stay Fresh with Our Newsletter
                    </Typography>
                    <Typography
                        variant="body1"
                        color="white"
                        paragraph
                        sx={{
                            maxWidth: 600,
                            mx: "auto",
                            mb: 4,
                            opacity: 0.9,
                        }}
                    >
                        Subscribe to get exclusive offers, seasonal updates, and
                        fruit-inspired recipes.
                    </Typography>

                    <Formik
                        initialValues={{ email: "" }}
                        validationSchema={NewsletterSchema}
                        onSubmit={handleNewsletterSubmit}
                    >
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                <Box
                                    sx={{
                                        display: "flex",
                                        gap: 2,
                                        maxWidth: 500,
                                        mx: "auto",
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row",
                                        },
                                        alignItems: {
                                            xs: "stretch",
                                            sm: "center",
                                        },
                                        justifyContent: "center",
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: "100%",
                                            position: "relative",
                                        }}
                                    >
                                        <Field name="email">
                                            {({ field }: FieldProps) => (
                                                <TextField
                                                    {...field}
                                                    variant="outlined"
                                                    placeholder="Enter your email"
                                                    fullWidth
                                                    sx={{
                                                        bgcolor: "white",
                                                        borderRadius: 1,
                                                        "& .MuiOutlinedInput-root":
                                                            {
                                                                "& fieldset": {
                                                                    border: "none",
                                                                },
                                                            },
                                                    }}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <FiMail
                                                                style={{
                                                                    marginRight: 8,
                                                                    color: "grey",
                                                                }}
                                                            />
                                                        ),
                                                    }}
                                                    error={
                                                        touched.email &&
                                                        !!errors.email
                                                    }
                                                />
                                            )}
                                        </Field>
                                        {touched.email && errors.email && (
                                            <Alert
                                                severity="error"
                                                sx={{
                                                    mt: 1,
                                                    bgcolor:
                                                        "rgba(255, 235, 238, 0.9)",
                                                    color: "error.main",
                                                    borderRadius: 1,
                                                    py: 0.5,
                                                    fontSize: "0.875rem",
                                                }}
                                            >
                                                {errors.email}
                                            </Alert>
                                        )}
                                    </Box>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            type="submit"
                                            disabled={isSubmitting}
                                            sx={{
                                                px: 4,
                                                py: 1.5,
                                                minWidth: {
                                                    xs: "100%",
                                                    sm: "auto",
                                                },
                                            }}
                                        >
                                            {isSubmitting
                                                ? "Submitting..."
                                                : "Subscribe"}
                                        </Button>
                                    </motion.div>
                                </Box>
                            </Form>
                        )}
                    </Formik>

                    {newsletterStatus && (
                        <Alert
                            severity={newsletterStatus}
                            sx={{
                                mt: 2,
                                maxWidth: 500,
                                mx: "auto",
                                borderRadius: 1,
                            }}
                        >
                            {newsletterStatus === "success"
                                ? "Thank you for subscribing!"
                                : "Failed to subscribe. Please try again."}
                        </Alert>
                    )}
                </Box>
            </Container>
        </Grid>
    );
}
