import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export const addFavoriteAPI = async (productId: string) =>
  axios.post('/api/favorites', { product_id: productId });

export const useAddFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFavoriteAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
