import Newsletter from '@/src/components/NewsLetter';
import { Grid } from '@mui/material';
import React from 'react';

import { BenefitsSection } from './BenefitsSection';
import { CTASection } from './CTASection';
import { FeaturedSection } from './FeaturedSection';
import { HeroSection } from './HeroSection';
import { useHomePage } from './Home.hooks';

export default function Home() {
  const { currentSlide, featuredProducts, isLoading, error } = useHomePage();

  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <HeroSection currentSlide={currentSlide} />
      <FeaturedSection
        featuredProducts={featuredProducts ?? []}
        isLoading={isLoading}
        error={error instanceof Error ? error.message : null}
      />
      <BenefitsSection />
      <CTASection />
      <Newsletter />
    </Grid>
  );
}
