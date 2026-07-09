import ProductCard from '@/src/components/ProductCard';
import { IProduct } from '@/types/index';
import { Box, Button, CircularProgress, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import React from 'react';
import { FiArrowRight } from 'react-icons/fi';

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  featuredProducts,
  isLoading,
  error,
}) => {
  const router = useRouter();

  return (
    <Grid>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 600 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Featured Products
        </Typography>
        <Button
          endIcon={<FiArrowRight />}
          onClick={() => router.push('/products')}
          component={motion.div}
          whileHover={{ x: 5 }}
        >
          View All
        </Button>
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          Failed to load featured products.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {featuredProducts?.map((product: IProduct, index: number) =>
            product.stock > 0 ? (
              <Grid
                item
                key={product.id}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                }}
                width={{ xs: '100%', sm: '50%', md: '25%' }}
              >
                <ProductCard product={product} />
              </Grid>
            ) : null
          )}
        </Grid>
      )}
    </Grid>
  );
};

export interface FeaturedSectionProps {
  featuredProducts: IProduct[];
  isLoading: boolean;
  error: string | null;
}
