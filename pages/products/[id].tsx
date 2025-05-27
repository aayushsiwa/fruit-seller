import { Container, Snackbar, Alert } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useProductDetail } from "@/hooks/useProductDetail";
import { BreadcrumbsNav } from "@/src/components/ProductDetail/BreadcrumbsNav";
import { ProductInfo } from "@/src/components/ProductDetail/ProductInfo";
import { RelatedProducts } from "@/src/components/ProductDetail/RelatedProducts";
import { LoadingScreen } from "@/src/components/LoadingScreen";

export default function ProductDetail() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const {
        product,
        isLoadingProduct,
        relatedProducts,
        cartQuantity,
        error,
        setError,
        snackbar,
        handleCloseSnackbar,
        handleAddToCart,
        handleQuantityChange,
        handleShare,
    } = useProductDetail();

    if (isLoadingProduct || !product) {
        return <LoadingScreen />;
    }

    return (
        <Container maxWidth="lg">
            <BreadcrumbsNav productName={product.name} />
            <ProductInfo
                product={product}
                isMobile={isMobile}
                cartQuantity={cartQuantity}
                error={error}
                setError={setError}
                handleAddToCart={handleAddToCart}
                handleQuantityChange={handleQuantityChange}
                handleShare={handleShare}
            />
            <RelatedProducts relatedProducts={relatedProducts ?? []} />
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
}
