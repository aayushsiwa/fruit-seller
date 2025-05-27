import React from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

export const CTASection: React.FC = () => {
    const router = useRouter();

    return (
        <Grid>
            <Box
                sx={{
                    bgcolor: "secondary.main",
                    borderRadius: 2,
                    p: { xs: 4, md: 6 },
                    textAlign: "center",
                    color: "white",
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
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    Ready to Order Fresh Fruits?
                </Typography>
                <Typography
                    variant="body1"
                    paragraph
                    sx={{ maxWidth: 600, mx: "auto", mb: 4, opacity: 0.9 }}
                >
                    Join thousands of satisfied customers who enjoy our
                    farm-fresh fruits delivered right to their doorstep.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => router.push("/products")}
                    sx={{ px: 4, py: 1.5 }}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Shop Now
                </Button>
            </Box>
        </Grid>
    );
};
