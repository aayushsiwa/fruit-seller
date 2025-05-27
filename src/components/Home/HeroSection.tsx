import React from "react";
import {
  Grid,
  Container,
  Typography,
  Button,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { heroSlides } from "@/config";
import { useRouter } from "next/router";
import { HeroSectionProps } from "@/types";

export const HeroSection: React.FC<HeroSectionProps> = ({ currentSlide }) => {
  const router = useRouter();

  return (
    <Grid
      sx={{
        position: "relative",
        minHeight: { xs: "70vh", md: "80vh" },
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: {
            xs: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.4))",
            md: "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3))",
          },
          zIndex: 1,
        },
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${heroSlides[currentSlide].image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </AnimatePresence>

      <Container
        sx={{
          position: "relative",
          zIndex: 2,
          px: { xs: 3, sm: 6 },
          py: { xs: 6, md: 10 },
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Typography
            variant="h2"
            component="h1"
            color="white"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: {
                xs: "clamp(2rem, 6vw, 3rem)",
                md: "clamp(3rem, 6vw, 4rem)",
              },
              textShadow: "0 4px 8px rgba(0,0,0,0.5)",
            }}
          >
            {heroSlides[currentSlide].title}
          </Typography>
          <Typography
            variant="h6"
            color="white"
            sx={{
              mb: 4,
              maxWidth: 600,
              opacity: 0.95,
              fontSize: { xs: "1rem", md: "1.25rem" },
            }}
          >
            {heroSlides[currentSlide].subtitle}
          </Typography>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              borderRadius: 8,
              overflow: "hidden",
              border: "none",
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => router.push(heroSlides[currentSlide].ctaLink)}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
              }}
            >
              {heroSlides[currentSlide].cta}
            </Button>
          </motion.button>
        </motion.div>
      </Container>
    </Grid>
  );
};