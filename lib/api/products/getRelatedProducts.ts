import { IProduct, Product } from '@/entity/Products/Products';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type GetRelatedProductsAPIResponse =
  { products: IProduct[] } | IProduct[];
export type GetRelatedProductsResponse = AxiosResponse<{ products: Product[] }>;

export const getRelatedProductsAPI = async (
  id: string
): Promise<GetRelatedProductsResponse> => {
  const response = await axios.get<GetRelatedProductsAPIResponse>(
    `/api/products?related=${id}`
  );
  const data = response.data as { products?: IProduct[] } & IProduct[];
  const mappedProducts = (
    data.products ??
    (response.data as IProduct[]) ??
    []
  ).map((p) => new Product(p));
  return { ...response, data: { products: mappedProducts } };
};

export const useGetRelatedProducts = (
  id: string | undefined,
  options?: Omit<
    UseQueryOptions<GetRelatedProductsResponse, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<GetRelatedProductsResponse> => {
  return useQuery({
    queryKey: ['relatedProducts', id],
    queryFn: () => getRelatedProductsAPI(id!),
    enabled: !!id,
    ...options,
  });
};
