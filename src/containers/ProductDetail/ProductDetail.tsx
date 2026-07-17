import { LoadingScreen } from '@/src/components/LoadingScreen';
import { BreadcrumbsNav } from '@/src/components/ProductDetail/BreadcrumbsNav';
import { ProductInfo } from '@/src/components/ProductDetail/ProductInfo';
import { RelatedProducts } from '@/src/components/ProductDetail/RelatedProducts';
import { Alert, Button, Container, Snackbar, Typography } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import Link from 'next/link';

import { useProductDetail } from './ProductDetail.hooks';

export default function ProductDetail() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    product,
    isLoadingProduct,
    isProductError,
    relatedProducts,
    cartQuantity,
    error,
    setError,
    snackbar,
    handleCloseSnackbar,
    handleAddToCart,
    handleQuantityChange,
    handleShare,
    isFavorite,
    handleToggleFavorite,
  } = useProductDetail();

  if (isProductError) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          The product you are looking for does not exist or may have been
          removed.
        </Typography>
        <Button variant="contained" component={Link} href="/products">
          Browse products
        </Button>
      </Container>
    );
  }

  if (isLoadingProduct || !product) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Head>
        <title>{`${product.name} | Fruit Seller`}</title>
        <meta
          name="description"
          content={
            product.description ||
            `Buy fresh, premium ${product.name} online at Fruit Seller.`
          }
        />
        <link
          rel="canonical"
          href={`https://fruitseller.com/products/${product.ID}`}
        />
        <meta property="og:title" content={`${product.name} | Fruit Seller`} />
        <meta
          property="og:description"
          content={
            product.description ||
            `Buy fresh, premium ${product.name} online at Fruit Seller.`
          }
        />
        <meta
          property="og:url"
          content={`https://fruitseller.com/products/${product.ID}`}
        />
        <meta property="og:type" content="product" />
        {product.images?.[0] && (
          <meta property="og:image" content={product.images[0].url} />
        )}
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
          isFavorite={isFavorite}
          handleToggleFavorite={handleToggleFavorite}
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
