import { useOrderWithProducts } from '@/lib/hooks/useOrderWithProducts';
import { useRouter } from 'next/router';

export const useOrderDetailPage = () => {
  const router = useRouter();
  const { order, products, isLoading, error } = useOrderWithProducts();

  const handleBackToOrders = () => {
    router.push('/orders');
  };

  return { order, products, isLoading, error, handleBackToOrders };
};
