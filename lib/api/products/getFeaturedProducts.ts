import { IProduct, Product } from '@/entity/Products/Products';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type GetFeaturedProductsAPIResponse = {
  products: IProduct[];
};

export type GetFeaturedProductsResponse = AxiosResponse<{
  products: Product[];
}>;

export const getFeaturedProductsAPI =
  async (): Promise<GetFeaturedProductsResponse> => {
    const response = await axios.get<GetFeaturedProductsAPIResponse>(
      '/api/products?featured=true'
    );

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

export const useGetFeaturedProducts = (
  options?: Omit<
    UseQueryOptions<GetFeaturedProductsResponse, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetFeaturedProductsResponse> => {
  return useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => getFeaturedProductsAPI(),
    ...options,
  });
};
