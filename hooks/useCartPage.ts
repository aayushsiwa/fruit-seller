import { useQueries } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCart } from "@/src/contexts/CartContext";
import { useSession, signIn } from "next-auth/react";
import { CartItem } from "@/types";
import axios from "axios";

const fetchProductDetails = async (id: string) => {
  const response = await axios.get(`/api/products/${id}`);
  return response.data;
};

export const useCartPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const {
    cart,
    updateQuantity,
    removeFromCart,
    getCartTotal,
    clearCart,
    showSnackbar,
    loading: cartLoading,
  } = useCart();

  const productQueries = useQueries({
    queries: cart.map((item: CartItem) => ({
      queryKey: ["product", item.id],
      queryFn: () => fetchProductDetails(item.id),
      enabled: !cartLoading,
    })),
  });

  const products = productQueries.map((query) => query.data);
  const isLoadingProducts = productQueries.some((query) => query.isLoading);
  const hasError = productQueries.some((query) => query.error);

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    maxQuantity: number
  ) => {
    if (newQuantity >= 1) {
      updateQuantity(id, newQuantity, maxQuantity);
    } else {
      removeFromCart(id);
    }
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
  };

  const handleContinueShopping = () => {
    router.push("/products");
  };

  const handleCheckout = () => {
    if (status === "unauthenticated") {
      signIn(undefined, { callbackUrl: "/checkout" });
      showSnackbar("Please sign in to proceed to checkout.", "error");
      return;
    }
    router.push("/checkout");
  };

  return {
    cart,
    products,
    isLoadingProducts,
    hasError,
    cartLoading,
    isLoading: cartLoading || isLoadingProducts,
    handleQuantityChange,
    handleRemoveItem,
    handleContinueShopping,
    handleCheckout,
    getCartTotal,
    clearCart,
  };
};
