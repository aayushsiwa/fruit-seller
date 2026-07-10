import { LoadingScreen } from '@/src/components/LoadingScreen';
import ProductCard from '@/src/components/ProductCard';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { FiHeart } from 'react-icons/fi';

import { useFavoritesPage } from './Favorites.hooks';

export default function Favorites() {
  const { favorites, isLoading, error, handleContinueShopping } =
    useFavoritesPage();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', p: 8, px: 2 }}>
          <FiHeart size={48} color="#e53935" />
          <Typography variant="h6" color="error" gutterBottom sx={{ mt: 2 }}>
            Failed to load favorites
          </Typography>
          <Typography color="text.secondary" paragraph>
            {error}
          </Typography>
          <Button variant="contained" onClick={handleContinueShopping}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  if (favorites.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4, mt: 2 }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            My Favorites
          </Typography>
        </Box>
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'rgba(229, 57, 53, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
            }}
          >
            <FiHeart size={40} color="#e53935" />
          </Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Your favorites list is empty
          </Typography>
          <Typography
            color="text.secondary"
            paragraph
            sx={{ maxWidth: 450, mb: 4 }}
          >
            Explore our wide variety of fresh, organic fruits and save your
            preferred items here for quick access later!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleContinueShopping}
            sx={{ borderRadius: 2, px: 4, py: 1.5 }}
          >
            Start Exploring
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4, mt: 2 }}>
        <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
          My Favorites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Easily access and shop your saved items ({favorites.length}{' '}
          {favorites.length === 1 ? 'item' : 'items'})
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {favorites.map((product, i) => (
          <Grid
            item
            key={product.id}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
