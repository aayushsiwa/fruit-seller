import { CartItem } from '@/types/index';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type InitPaymentResponse = {
  razorpayOrderID: string;
  amount: number;
  key_id: string;
};

export const initPaymentAPI = async (
  cart: CartItem[],
  total: number
): Promise<AxiosResponse<InitPaymentResponse>> => {
  return axios.post<InitPaymentResponse>('/api/payments/init', { cart, total });
};

export const useInitPayment = () => {
  return useMutation({
    mutationFn: ({ cart, total }: { cart: CartItem[]; total: number }) =>
      initPaymentAPI(cart, total),
  });
};
