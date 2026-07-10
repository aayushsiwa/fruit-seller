import { IProduct, Product } from '@/entity/Products/Products';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type GetProductAPIResponse = IProduct;
export type GetProductResponse = AxiosResponse<{ product: Product }>;

export const getProductAPI = async (
  id: string
): Promise<GetProductResponse> => {
  const response = await axios.get<GetProductAPIResponse>(
    `/api/products/${id}`
  );
  return { ...response, data: { product: new Product(response.data) } };
};

export const useGetProduct = (
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<GetProductResponse, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetProductResponse> => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductAPI(id!),
    enabled: !!id,
    retry: false,
    ...options,
  });
};
