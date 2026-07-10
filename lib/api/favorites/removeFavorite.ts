import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const removeFavoriteAPI = async (productId: string) =>
  axios.delete(`/api/favorites/${productId}`);

export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeFavoriteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
