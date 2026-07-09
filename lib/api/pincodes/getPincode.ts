import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type PincodeData = {
  city: string;
  state: string;
};

export const getPincodeAPI = async (
  pincode: string
): Promise<AxiosResponse<PincodeData>> => {
  return axios.get<PincodeData>(`/api/pincodes/${pincode}`);
};

export const useGetPincode = (
  pincode: string,
  enabled: boolean,
  options?: Omit<
    UseQueryOptions<AxiosResponse<PincodeData>, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AxiosResponse<PincodeData>> => {
  return useQuery({
    queryKey: ['pincode', pincode],
    queryFn: () => getPincodeAPI(pincode),
    enabled,
    staleTime: Infinity,
    ...options,
  });
};
