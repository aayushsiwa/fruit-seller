import { Order } from '@/entity/Orders/Orders';
import type { Order as OrderType } from '@/types/index';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type GetOrdersResponse = AxiosResponse<Order[]>;

export const getOrdersAPI = async (): Promise<GetOrdersResponse> => {
  const response = await axios.get('/api/orders');
  const orders = response.data
    ? response.data.map((o: OrderType) => new Order(o))
    : [];
  return {
    ...response,
    data: orders,
  };
};

export const useGetOrders = (
  options?: Omit<
    UseQueryOptions<GetOrdersResponse, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetOrdersResponse> => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => getOrdersAPI(),
    ...options,
  });
};
