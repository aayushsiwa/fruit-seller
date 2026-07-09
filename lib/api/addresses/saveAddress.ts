import { Address } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const saveAddressAPI = async (address: Address) =>
  axios.post<Address>('/api/addresses', address);

export const useSaveAddress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveAddressAPI,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  });
};
