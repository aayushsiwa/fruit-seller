import Footer from '@/src/components/Footer';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import Navbar from '@/src/components/Navbar/Navbar';
import { useAuth } from '@/src/contexts/AuthContext';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

const AUTH_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

const AuthNavbar = () => (
  <AppBar position="sticky" elevation={0} sx={{ bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
    <Toolbar sx={{ justifyContent: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
        Fruit Seller
      </Typography>
    </Toolbar>
  </AppBar>
);

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const auth = useAuth();
  const loading = auth?.loading;
  const { pathname } = useRouter();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

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
      {isAuthPage ? <AuthNavbar /> : <Navbar />}
      <Container component="main" sx={{ flexGrow: 1, py: 2 }} maxWidth="xl">
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;

export interface LayoutProps {
  children: React.ReactNode;
}
