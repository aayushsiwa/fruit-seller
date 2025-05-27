import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCart } from "@/src/contexts/CartContext";
import { ItemType } from "@/types";
import axios from "axios";

const fetchProductDetails = async (id: string) => {
    const response = await axios.get(`/api/products/${id}`);
    if (response.status !== 200 || !response.data) {
        throw new Error("Failed to fetch product details");
    }
    return response.data;
};

const fetchRelatedProducts = async (id: string) => {
    const response = await axios.get(`/api/products?related=${id}`);
    if (response.status !== 200 || !response.data) {
        throw new Error("Failed to fetch related products");
    }
    return response.data;
};

export const useProductDetail = () => {
    const router = useRouter();
    const { id } = router.query;
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({ open: false, message: "", severity: "success" });

    const { data: product, isLoading: isLoadingProduct } = useQuery<ItemType>({
        queryKey: ["product", id],
        queryFn: () => fetchProductDetails(id as string),
        enabled: !!id,
    });

    const { data: relatedProducts } = useQuery<ItemType[]>({
        queryKey: ["relatedProducts", id],
        queryFn: () => fetchRelatedProducts(id as string),
        enabled: !!id,
    });

    const cartItem = cart.find((item) => item.id === (id as string));
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    const handleAddToCart = () => {
        if (product && product.quantity >= 1) {
            addToCart(product, 1);
            setError(null);
        } else {
            setError("Cannot add to cart: out of stock.");
        }
    };

    const handleQuantityChange = (newQuantity: number) => {
        if (!product) return;

        if (newQuantity <= 0) {
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, newQuantity, product.quantity);
        }
    };

    const handleShare = () => {
        navigator.clipboard
            .writeText(window.location.href)
            .then(() => {
                setSnackbar({
                    open: true,
                    message: "Link copied to clipboard!",
                    severity: "success",
                });
            })
            .catch((err) => {
                console.error("Failed to copy: ", err);
                setSnackbar({
                    open: true,
                    message: "Failed to copy link.",
                    severity: "error",
                });
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    return {
        product,
        isLoadingProduct,
        relatedProducts,
        cartQuantity,
        error,
        setError,
        snackbar,
        handleCloseSnackbar,
        handleAddToCart,
        handleQuantityChange,
        handleShare,
        isMobile: false,
    };
};
