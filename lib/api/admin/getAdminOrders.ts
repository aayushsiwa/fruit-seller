import { Order } from '@/entity/Orders/Orders';
import { Order as OrderType } from '@/types/index';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getAdminOrdersAPI = async () => {
  const response = await axios.get<OrderType[]>('/api/admin/orders');
  if (response.status !== 200) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  return response.data.map((o) => new Order(o));
};

export const useGetAdminOrders = (
  isAdmin: boolean,
  options?: Omit<UseQueryOptions<Order[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['adminOrders'],
    queryFn: getAdminOrdersAPI,
    enabled: isAdmin,
    ...options,
  });
