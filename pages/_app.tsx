import { queryClient } from '@/lib/api';
import { ThemeSwitchProvider } from '@/src/ThemeProvider';
import ErrorBoundary from '@/src/components/ErrorBoundary';
import Layout from '@/src/components/Layout';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { CartProvider } from '@/src/contexts/CartContext';
import { SnackbarProvider } from '@/src/contexts/SnackBarContext';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Fruit Seller - Fresh Fruits Delivered</title>
      </Head>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <SnackbarProvider>
            <AuthProvider>
              <CartProvider>
                <ThemeSwitchProvider>
                  <Layout>
                    <ErrorBoundary>
                      <Component {...pageProps} />
                    </ErrorBoundary>
                  </Layout>
                </ThemeSwitchProvider>
              </CartProvider>
            </AuthProvider>
          </SnackbarProvider>
        </QueryClientProvider>
      </SessionProvider>
    </>
  );
}
