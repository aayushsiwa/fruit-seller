import { IProduct, Product } from '@/entity/Products/Products';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const getFavoritesAPI = async (): Promise<AxiosResponse<Product[]>> => {
  const response = await axios.get<IProduct[]>('/api/favorites');
  const products = (response.data ?? []).map((product) => new Product(product));
  return {
    ...response,
    data: products,
  };
};

export const useGetFavorites = (
  options?: Omit<
    UseQueryOptions<AxiosResponse<Product[]>, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AxiosResponse<Product[]>> => {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: getFavoritesAPI,
    ...options,
  });
};
