import React from "react";
import {
  Grid,
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { motion } from "framer-motion";
import { benefits } from "@/config";

export const BenefitsSection: React.FC = () => {
  return (
    <Grid>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
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
          Why Choose Us?
        </Typography>
      </Box>
      <Grid container spacing={4} justifyContent="center">
        {benefits.map((benefit, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={3}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card
              sx={{
                height: "100%",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                borderRadius: 2,
                transition: "transform 0.3s",
                "&:hover": { transform: "translateY(-8px)" },
              }}
            >
              <CardMedia
                component="img"
                image={benefit.image}
                alt={benefit.title}
                sx={{
                  height: 150,
                  objectFit: "cover",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                }}
              />
              <CardContent sx={{ textAlign: "center", p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};