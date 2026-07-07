import Footer from '@/src/components/Footer';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import Navbar from '@/src/components/Navbar/Navbar';
import { useAuth } from '@/src/contexts/AuthContext';
import { LayoutProps } from '@/types/index';
import { Box, Container } from '@mui/material';
import React from 'react';

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const loading = auth?.loading;

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
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
