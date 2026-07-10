import { User } from '@/entity/Users/Users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export type UpdateProfileVars = {
  firstName: string;
  lastName: string;
};

export const updateProfileAPI = async (
  vars: UpdateProfileVars
): Promise<User> => {
  const response = await axios.put<User>('/api/users/profile', vars);
  return new User(response.data);
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfileAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['profile'] }),
  });
};
