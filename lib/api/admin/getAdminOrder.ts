import { Order } from '@/entity/Orders/Orders';
import { Order as OrderType } from '@/types/index';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getAdminOrderAPI = async (id: string) => {
  const response = await axios.get<OrderType>(`/api/admin/orders/${id}`);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch order: ${response.statusText}`);
  }
  return new Order(response.data);
};

export const useGetAdminOrder = (
  id: string | undefined,
  options?: Omit<UseQueryOptions<Order, Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['adminOrder', id],
    queryFn: () => getAdminOrderAPI(id as string),
    enabled: !!id,
    ...options,
  });
