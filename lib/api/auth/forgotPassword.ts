import { useMutation } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';

export type ForgotPasswordPayload = {
  email: string;
};

export type ForgotPasswordResponse = AxiosResponse<{
  success: boolean;
  emailSent: boolean;
  message: string;
  resetLink?: string;
}>;

export const forgotPasswordAPI = async (
  payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> => {
  return axios.post('/api/auth/forgot-password', payload);
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPasswordAPI,
  });
};
