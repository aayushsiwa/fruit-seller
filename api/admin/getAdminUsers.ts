import { User } from '@/entity/Users/Users';
import { User as UserType } from '@/types/index';
import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const getAdminUsersAPI = async () => {
  const response = await axios.get<UserType[]>('/api/admin/users');
  if (response.status !== 200) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  return response.data.map((u) => new User(u));
};

export const useGetAdminUsers = (
  isAdmin: boolean,
  options?: Omit<UseQueryOptions<User[], Error>, 'queryKey' | 'queryFn'>
) =>
  useQuery({
    queryKey: ['adminUsers'],
    queryFn: getAdminUsersAPI,
    enabled: isAdmin,
    ...options,
  });
