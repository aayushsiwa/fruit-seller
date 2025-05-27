import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        bgcolor: "primary.light",
        textAlign: "center",
        px: { xs: 2, sm: 4 },
      }}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{ color: "primary.main" }}
          aria-label="Loading fresh fruits"
        />
      </motion.div>
      <Typography
        variant="h5"
        sx={{
          mt: 3,
          color: "white",
          fontWeight: 600,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Loading Fresh Fruits...
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 1,
          color: "white",
          opacity: 0.8,
          maxWidth: 400,
        }}
      >
        Getting the freshest picks ready for you!
      </Typography>
    </Box>
  );
};
