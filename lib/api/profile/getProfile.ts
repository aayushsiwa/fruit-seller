import { User } from '@/entity/Users/Users';
import {
  UseQueryOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export const getProfileAPI = async (): Promise<AxiosResponse<User>> => {
  const response = await axios.get<User>('/api/users/profile');
  return { ...response, data: new User(response.data) };
};

export const useGetProfile = (
  options?: Omit<
    UseQueryOptions<AxiosResponse<User>, Error>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<AxiosResponse<User>> => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: getProfileAPI,
    ...options,
  });
};
