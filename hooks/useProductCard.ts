import { useCart } from '@/src/contexts/CartContext';
import { IProduct } from '@/types/index';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import { MouseEvent } from 'react';

const useProductCard = (product: IProduct): UseProductCardReturn => {
  const router = useRouter();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

  const cartItem = cart.find((item) => item.id === product.id);
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
      removeFromCart(product.id);
    } else if (newQuantity <= product.stock) {
      updateQuantity(product.id, newQuantity, product.stock);
    }
  };

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.stopPropagation();
    const value = Number.parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= product.stock) {
      if (value === 0) {
        removeFromCart(product.id);
      } else {
        updateQuantity(product.id, value, product.stock);
      }
    }
  };

  return {
    cartQuantity,
    discountedPrice,
    isOutOfStock,
    handleAddToCart,
    handleQuantityChange,
    handleViewDetails,
    handleInputChange,
  };
};

export default useProductCard;

export type UseProductCardReturn = {
  cartQuantity: number;
  discountedPrice: number | null;
  isOutOfStock: boolean;
  handleAddToCart: (e: MouseEvent) => void;
  handleQuantityChange: (e: MouseEvent, newQuantity: number) => void;
  handleViewDetails: () => void;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};
