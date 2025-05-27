import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/src/components/ProductCard";
import { RelatedProductsProps } from "@/types";

export const RelatedProducts: React.FC<RelatedProductsProps> = ({
    relatedProducts,
}) => {
    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }

    return (
        <Box
            sx={{ mt: 6, mb: 4 }}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
        >
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                Related Products
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                <AnimatePresence>
                    {relatedProducts.map((relatedProduct, index) => (
                        <Box
                            key={relatedProduct.id}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: "48%",
                                    md: "31%",
                                },
                            }}
                            component={motion.div}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{
                                duration: 0.5,
                                delay: index * 0.1,
                            }}
                        >
                            <ProductCard product={relatedProduct} />
                        </Box>
                    ))}
                </AnimatePresence>
            </Box>
        </Box>
    );
};
