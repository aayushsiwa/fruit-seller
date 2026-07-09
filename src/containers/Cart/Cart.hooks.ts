import { getProductAPI } from '@/api/products/getProduct';
import { useCart } from '@/src/contexts/CartContext';
import { CartItem, IProduct } from '@/types/index';
import { useQueries } from '@tanstack/react-query';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export const useCartPage = (): UseCartPageReturn => {
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
      queryKey: ['product', item.id],
      queryFn: async () => {
        const response = await getProductAPI(item.id);
        return response.data.product;
      },
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
    router.push('/products');
  };

  const handleCheckout = () => {
    if (status === 'unauthenticated') {
      signIn(undefined, { callbackUrl: '/checkout' });
      showSnackbar('Please sign in to proceed to checkout.', 'error');
      return;
    }
    router.push('/checkout');
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

export type UseCartPageReturn = {
  cart: CartItem[];
  products: (IProduct | undefined)[];
  isLoadingProducts: boolean;
  hasError: boolean;
  cartLoading: boolean;
  isLoading: boolean;
  handleQuantityChange: (
    id: string,
    newQuantity: number,
    maxQuantity: number
  ) => void;
  handleRemoveItem: (id: string) => void;
  handleContinueShopping: () => void;
  handleCheckout: () => void;
  getCartTotal: (products: (IProduct | undefined)[]) => number;
  clearCart: () => void;
};
