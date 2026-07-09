import { useGetProduct } from '@/lib/api/products/getProduct';
import { useGetRelatedProducts } from '@/lib/api/products/getRelatedProducts';
import { useCart } from '@/src/contexts/CartContext';
import { IProduct } from '@/types/index';
import { SnackbarCloseReason } from '@mui/material';
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

  const { data: getProductResponse, isLoading: isLoadingProduct } =
    useGetProduct(id as string);
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
      removeFromCart(product.id);
    } else {
      updateQuantity(product.id, newQuantity, product.stock);
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

export interface UseProductDetailReturn {
  product: IProduct | undefined;
  isLoadingProduct: boolean;
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
}
