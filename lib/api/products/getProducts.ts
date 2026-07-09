import { IProduct, Product } from '@/entity/Products/Products';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type GetProductsAPIResponse = {
  products: IProduct[];
};

export type GetProductsResponse = AxiosResponse<{
  products: Product[];
}>;

export const getProductsAPI = async (): Promise<GetProductsResponse> => {
  const response = await axios.get<GetProductsAPIResponse>('/api/products');

  const products = (response.data.products ?? []).map(
    (product) => new Product(product)
  );

  return {
    ...response,
    data: {
      ...response.data,
      products,
    },
  };
};

export const useGetProducts = (
  options?: Omit<
    UseQueryOptions<GetProductsResponse, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetProductsResponse> => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => getProductsAPI(),
    ...options,
  });
};
