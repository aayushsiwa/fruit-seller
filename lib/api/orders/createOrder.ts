import { Order } from '@/entity/Orders/Orders';
import { Address, CartItem } from '@/types/index';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type CreateOrderPayload = {
  cart: CartItem[];
  total: number;
  razorpayPaymentID: string;
  razorpayOrderID: string;
  razorpaySignature: string;
  shippingAddress: Address;
};

export type CreateOrderResponse = AxiosResponse<{ order: Order }>;

export const createOrderAPI = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  const response = await axios.post<{ order: Order }>('/api/orders', payload);

  return {
    ...response,
    data: {
      ...response.data,
      order: new Order(response.data.order),
    },
  };
};

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: createOrderAPI,
  });
};
