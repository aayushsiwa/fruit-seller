import { useAddFavorite } from '@/lib/api/favorites/addFavorite';
import { useGetFavorites } from '@/lib/api/favorites/getFavorites';
import { useRemoveFavorite } from '@/lib/api/favorites/removeFavorite';
import { useCart } from '@/src/contexts/CartContext';
import { IProduct } from '@/types/index';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { MouseEvent } from 'react';

const useProductCard = (product: IProduct): UseProductCardReturn => {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const { data: favoritesRes } = useGetFavorites({ enabled: isLoggedIn });
  const favorites = favoritesRes?.data || [];
  const isFavorite = favorites.some((fav) => fav.ID === product.ID);

  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  const cartItem = cart.find((item) => item.productID === product.ID);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = (e: MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleQuantityChange = (e: MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    if (newQuantity <= 0) {
      removeFromCart(product.ID);
    } else if (newQuantity <= product.stock) {
      updateQuantity(product.ID, newQuantity, product.stock);
    }
  };

  const handleViewDetails = () => {
    router.push(`/products/${product.ID}`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.stopPropagation();
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= product.stock) {
      if (value === 0) {
        removeFromCart(product.ID);
      } else {
        updateQuantity(product.ID, value, product.stock);
      }
    }
  };

  const handleToggleFavorite = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`);
      return;
    }

    if (isFavorite) {
      await removeFavoriteMutation.mutateAsync(product.ID);
    } else {
      await addFavoriteMutation.mutateAsync(product.ID);
    }
  };

  return {
    cartQuantity,
    discountedPrice,
    isOutOfStock,
    isFavorite,
    handleAddToCart,
    handleQuantityChange,
    handleViewDetails,
    handleInputChange,
    handleToggleFavorite,
  };
};

export default useProductCard;

export type UseProductCardReturn = {
  cartQuantity: number;
  discountedPrice: number | null;
  isOutOfStock: boolean;
  isFavorite: boolean;
  handleAddToCart: (e: MouseEvent) => void;
  handleQuantityChange: (e: MouseEvent, newQuantity: number) => void;
  handleViewDetails: () => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleToggleFavorite: (e: MouseEvent) => void;
};
