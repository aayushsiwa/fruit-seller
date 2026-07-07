import React from "react";
import { Grid } from "@mui/material";
import { useHomePage } from "./Home.hooks";
import { HeroSection } from "./HeroSection";
import { FeaturedSection } from "./FeaturedSection";
import { BenefitsSection } from "./BenefitsSection";
import { CTASection } from "./CTASection";
import Newsletter from "@/src/components/NewsLetter";

export default function Home() {
    const { currentSlide, featuredProducts, isLoading, error } = useHomePage();

    return (
        <Grid sx={{ display: "flex", flexDirection: "column", gap: "4rem" }}>
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
