import Head from "next/head";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { SnackbarProvider } from "@/src/contexts/SnackBarContext";
import { AuthProvider } from "@/src/contexts/AuthContext";
import { CartProvider } from "@/src/contexts/CartContext";
import Layout from "@/src/components/Layout";
import type { AppProps } from "next/app";
import { ThemeSwitchProvider } from "@/src/ThemeProvider";

export default function App(props: AppProps) {
    const { Component, pageProps } = props;
    const queryClient = new QueryClient();

    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
                <title>Fruit Seller - Fresh Fruits Delivered</title>
            </Head>
            <SessionProvider session={pageProps.session}>
                <QueryClientProvider client={queryClient}>
                    <SnackbarProvider>
                        <AuthProvider>
                            <CartProvider>
                                <ThemeSwitchProvider>
                                    <Layout>
                                        <Component {...pageProps} />
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
