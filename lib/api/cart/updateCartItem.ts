import { CartItem } from '@/types/index';
import axios from 'axios';

export type UpdateCartItemPayload = { product_id: string; quantity: number };

export const updateCartItemAPI = async (
  payload: UpdateCartItemPayload
): Promise<CartItem> => {
  const response = await axios.put<CartItem>('/api/cart', payload);
  return response.data;
};
