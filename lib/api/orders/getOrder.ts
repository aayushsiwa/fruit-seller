import { Order } from '@/entity/Orders/Orders';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type GetOrderResponse = AxiosResponse<Order>;

export const getOrderAPI = async (
  orderId: string
): Promise<GetOrderResponse> => {
  const response = await axios.get(`/api/orders/${orderId}`);
  const order = response.data ? new Order(response.data) : null;
  if (!order) {
    throw new Error('Order not found');
  }
  return {
    ...response,
    data: order,
  };
};

export const useGetOrder = (
  orderId: string,
  options?: Omit<
    UseQueryOptions<GetOrderResponse, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetOrderResponse> => {
  return useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderAPI(orderId),
    enabled: !!orderId,
    ...options,
  });
};
