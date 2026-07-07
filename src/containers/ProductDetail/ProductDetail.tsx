import { LoadingScreen } from '@/src/components/LoadingScreen';
import { BreadcrumbsNav } from '@/src/components/ProductDetail/BreadcrumbsNav';
import { ProductInfo } from '@/src/components/ProductDetail/ProductInfo';
import { RelatedProducts } from '@/src/components/ProductDetail/RelatedProducts';
import { Alert, Container, Snackbar } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import Head from 'next/head';
import { useProductDetail } from './ProductDetail.hooks';

export default function ProductDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
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
    <>
      <Head>
        <title>{`${product.name} | Fruit Seller`}</title>
        <meta name="description" content={product.description || `Buy fresh, premium ${product.name} online at Fruit Seller.`} />
        <link rel="canonical" href={`https://fruitseller.com/products/${product.id}`} />
        <meta property="og:title" content={`${product.name} | Fruit Seller`} />
        <meta property="og:description" content={product.description || `Buy fresh, premium ${product.name} online at Fruit Seller.`} />
        <meta property="og:url" content={`https://fruitseller.com/products/${product.id}`} />
        <meta property="og:type" content="product" />
        {product.image && <meta property="og:image" content={product.image} />}
      </Head>
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
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
    </>
  );
}
