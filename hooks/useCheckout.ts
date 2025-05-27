import { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCart } from "@/src/contexts/CartContext";
import { useSession } from "next-auth/react";
import { ItemType } from "@/types";
import axios from "axios";

const fetchProductDetails = async (id: string) => {
    try {
        const response = await axios.get(`/api/products/${id}`);
        if (response.status !== 200 || !response.data) {
            throw new Error(`Failed to fetch product ${id}`);
        }
        return response.data;
    } catch (error) {
        throw new Error(
            `Failed to fetch product ${id} : ${
                error instanceof Error ? error.message : "Unknown error"
            }`
        );
    }
};

export const useCheckout = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {
        cart,
        getCartTotal,
        clearCart,
        showSnackbar,
        loading: cartLoading,
    } = useCart();
    const [processing, setProcessing] = useState(false);

    const productQueries = useQueries({
        queries: cart.map((item) => ({
            queryKey: ["product", item.id],
            queryFn: () => fetchProductDetails(item.id),
            enabled: !cartLoading,
        })),
    });

    const products = productQueries.map((query) => query.data as ItemType);
    const isLoadingProducts = productQueries.some((query) => query.isLoading);
    const hasError = productQueries.some((query) => query.error);

    const handlePayNow = async () => {
        if (!session || status !== "authenticated") {
            showSnackbar("Please sign in to proceed.", "error");
            return;
        }

        for (let i = 0; i < cart.length; i++) {
            const item = cart[i];
            const product = products[i];
            if (!product) {
                showSnackbar(
                    `Product ${item.id} not found or invalid.`,
                    "error"
                );
                return;
            }
            if (product.quantity < item.quantity) {
                showSnackbar(
                    `Insufficient stock for ${product.name}.`,
                    "error"
                );
                return;
            }
        }

        setProcessing(true);
        try {
            const total = getCartTotal(products) + getCartTotal(products) * 0.1;
            const response = await axios.post(
                "/api/orders",
                { cart, total },
                { headers: { "Content-Type": "application/json" } }
            );

            if (response.status !== 200 || !response.data) {
                const errorMsg =
                    response.data?.error || "Failed to process order.";
                showSnackbar(errorMsg, "error");
                setProcessing(false);
                return;
            }

            const { order } = response.data;
            clearCart();
            showSnackbar("Order placed successfully!", "success");
            router.push(`/success?orderId=${order.id}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                showSnackbar(error.message, "error");
            }
            setProcessing(false);
        }
    };

    return {
        cart,
        products,
        isLoading: status === "loading" || cartLoading,
        isLoadingProducts,
        hasError,
        processing,
        handlePayNow,
        status,
        getCartTotal,
    };
};
