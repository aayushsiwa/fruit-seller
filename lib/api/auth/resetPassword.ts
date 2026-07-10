import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type ResetPasswordPayload = {
  token: string;
  password?: string;
};

export type ResetPasswordResponse = AxiosResponse<{
  success: boolean;
  message: string;
}>;

export const resetPasswordAPI = async (
  payload: ResetPasswordPayload
): Promise<ResetPasswordResponse> => {
  return axios.post('/api/auth/reset-password', payload);
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPasswordAPI,
  });
};
