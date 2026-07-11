import { CartItem } from '@/types/index';
import axios from 'axios';

export type SaveCartItemPayload = { productID: string; quantity: number };

export const saveCartItemAPI = async (
  payload: SaveCartItemPayload
): Promise<CartItem> => {
  const response = await axios.post<CartItem>('/api/cart', payload);
  return response.data;
};
