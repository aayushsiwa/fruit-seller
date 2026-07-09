import { Address } from '@/types/index';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const getAddressesAPI = async (): Promise<AxiosResponse<Address[]>> => {
  return axios.get<Address[]>('/api/addresses');
};

export const useGetAddresses = (
  enabled: boolean,
  options?: Omit<
    UseQueryOptions<AxiosResponse<Address[]>, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AxiosResponse<Address[]>> => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: getAddressesAPI,
    enabled,
    ...options,
  });
};
