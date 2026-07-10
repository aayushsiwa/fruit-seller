import { CartItem } from '@/types/index';
import axios from 'axios';

export const getCartAPI = async (): Promise<CartItem[]> => {
  const response = await axios.get<CartItem[]>('/api/cart');
  return response.data;
};
