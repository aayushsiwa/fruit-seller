import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

export type ChangePasswordVars = {
  currentPassword: string;
  newPassword: string;
};

export const changePasswordAPI = async (vars: ChangePasswordVars) => {
  const response = await axios.put('/api/users/change-password', vars);
  return response.data;
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePasswordAPI,
  });
};
