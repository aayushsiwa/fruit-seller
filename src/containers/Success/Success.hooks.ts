import { useOrderWithProducts } from '@/lib/hooks/useOrderWithProducts';
import { IProduct, Order } from '@/types/index';
import { useRouter } from 'next/router';

export const useSuccess = () => {
  const router = useRouter();
  const { order, products, isLoading, error } = useOrderWithProducts();

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return {
    order,
    products,
    isLoading,
    error,
    handleContinueShopping,
  };
};

export type UseSuccessReturn = {
  order: Order | null;
  products: (IProduct | undefined)[];
  isLoading: boolean;
  error: string | null;
  handleContinueShopping: () => void;
};
