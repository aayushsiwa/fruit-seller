import { useAddFavorite } from '@/lib/api/favorites/addFavorite';
import { useGetFavorites } from '@/lib/api/favorites/getFavorites';
import { useRemoveFavorite } from '@/lib/api/favorites/removeFavorite';
import { useGetProduct } from '@/lib/api/products/getProduct';
import { useGetRelatedProducts } from '@/lib/api/products/getRelatedProducts';
import { useCart } from '@/src/contexts/CartContext';
import { IProduct } from '@/types/index';
import { SnackbarCloseReason } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const useProductDetail = (): UseProductDetailReturn => {
  const router = useRouter();
  const { id } = router.query;
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const { data: favoritesRes } = useGetFavorites({ enabled: isLoggedIn });
  const favorites = favoritesRes?.data || [];
  const isFavorite = favorites.some((fav) => fav.ID === (id as string));

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const {
    data: getProductResponse,
    isLoading: isLoadingProduct,
    isError: isProductError,
  } = useGetProduct(id as string);
  const product = getProductResponse?.data?.product;

  const { data: getRelatedProductsResponse } = useGetRelatedProducts(
    id as string
  );
  const relatedProducts = getRelatedProductsResponse?.data?.products;

  const cartItem = cart.find((item) => item.id === (id as string));
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (product && product.stock >= 1) {
      addToCart(product, 1);
      setError(null);
    } else {
      setError('Cannot add to cart: out of stock.');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (!product) return;

    if (newQuantity <= 0) {
      removeFromCart(product.ID);
    } else {
      updateQuantity(product.ID, newQuantity, product.stock);
    }
  };

  const handleShare = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Link copied to clipboard!',
          severity: 'success',
        });
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        setSnackbar({
          open: true,
          message: 'Failed to copy link.',
          severity: 'error',
        });
      });
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleToggleFavorite = async () => {
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }
    if (!id || typeof id !== 'string') return;

    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync(id);
    } else {
      await addFavoriteMutation.mutateAsync(id);
    }
  };

  return {
    product,
    isLoadingProduct,
    isProductError,
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
    isFavorite,
    handleToggleFavorite,
  };
};

export interface UseProductDetailReturn {
  product: IProduct | undefined;
  isLoadingProduct: boolean;
  isProductError: boolean;
  relatedProducts: IProduct[] | undefined;
  cartQuantity: number;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  snackbar: {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  };
  handleCloseSnackbar: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  handleAddToCart: () => void;
  handleQuantityChange: (newQuantity: number) => void;
  handleShare: () => void;
  isMobile: boolean;
  isFavorite: boolean;
  handleToggleFavorite: () => void;
}
