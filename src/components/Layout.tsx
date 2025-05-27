import React from "react";
import { Container, Box } from "@mui/material";
import Navbar from "@/src/components/Navbar/index";
import Footer from "@/src/components/Footer";
import { useAuth } from "@/src/contexts/AuthContext";
import { LayoutProps } from "@/types";
import { LoadingScreen } from "@/src/components/LoadingScreen";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const loading = auth?.loading;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Container component="main" sx={{ flexGrow: 1, py: 2 }} maxWidth="xl">
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;