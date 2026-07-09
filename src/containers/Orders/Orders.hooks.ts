import { useGetOrders } from '@/api/orders/getOrders';
import { Order } from '@/types/index';
import { useRouter } from 'next/router';

export const useOrdersPage = (): UseOrdersPageReturn => {
  const router = useRouter();
  const { data: response, isLoading, error } = useGetOrders();
  const orders = response?.data || [];

  const handleViewOrder = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const handleContinueShopping = () => {
    router.push('/products');
  };

  return {
    orders,
    isLoading,
    error: error ? error.message : null,
    handleViewOrder,
    handleContinueShopping,
  };
};

export type UseOrdersPageReturn = {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  handleViewOrder: (orderId: string) => void;
  handleContinueShopping: () => void;
};
