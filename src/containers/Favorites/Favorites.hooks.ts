import { Product } from '@/entity/Products/Products';
import { useGetFavorites } from '@/lib/api/favorites/getFavorites';
import { useRouter } from 'next/router';

export const useFavoritesPage = (): UseFavoritesPageReturn => {
  const router = useRouter();
  const { data: response, isLoading, error } = useGetFavorites();
  const favorites = response?.data || [];

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return {
    favorites,
    isLoading,
    error: error ? error.message : null,
    handleContinueShopping,
  };
};

export type UseFavoritesPageReturn = {
  favorites: Product[];
  isLoading: boolean;
  error: string | null;
  handleContinueShopping: () => void;
};
