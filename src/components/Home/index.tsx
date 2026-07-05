import React from "react";
import { Grid } from "@mui/material";
import { useHomePage } from "@/hooks/useHomePage";
import { HeroSection } from "@/src/components/Home/HeroSection";
import { FeaturedSection } from "@/src/components/Home/FeaturedSection";
import { BenefitsSection } from "@/src/components/Home/BenefitsSection";
import { CTASection } from "@/src/components/Home/CTASection";
import Newsletter from "@/src/components/NewsLetter";

export default function Home() {
    const { currentSlide, featuredProducts, isLoading, error } = useHomePage();

    return (
        <Grid sx={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
            <HeroSection currentSlide={currentSlide} />
            <FeaturedSection
                featuredProducts={featuredProducts}
                isLoading={isLoading}
                error={error ? error.message : null}
            />
            <BenefitsSection />
            <CTASection />
            <Newsletter />
        </Grid>
    );
}
