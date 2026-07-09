import { Product } from '@/entity/Products/Products';
import { IProduct } from '@/types/index';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getAdminProductsAPI = async () => {
  const response = await axios.get<IProduct[]>('/api/products');
  if (response.status !== 200) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.data.map((p) => new Product(p));
};

export const useGetAdminProducts = (
  isAdmin: boolean,
  options?: Omit<UseQueryOptions<Product[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['adminProducts'],
    queryFn: getAdminProductsAPI,
    enabled: isAdmin,
    ...options,
  });
