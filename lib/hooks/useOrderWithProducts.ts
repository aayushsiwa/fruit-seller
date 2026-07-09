import { getOrderAPI } from '@/api/orders/getOrder';
import { Order } from '@/entity/Orders/Orders';
import { Product } from '@/entity/Products/Products';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

interface UseOrderWithProductsReturn {
  order?: Order | null;
  products?: Product[];
  isLoading: boolean;
  error: string | null;
}

export const useOrderWithProducts = (): UseOrderWithProductsReturn => {
  const router = useRouter();
  const { orderId } = router.query;

  // 1. Fetch Order Details
  const {
    data: orderResponse,
    isLoading,
    error: orderError,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderAPI(orderId as string),
    enabled: !!orderId && typeof orderId === 'string',
  });

  const order = orderResponse?.data;
  const products = order?.items
    ?.map((item) => (item.product ? new Product(item.product) : undefined))
    .filter(Boolean) as Product[];

  return {
    order: order ?? null,
    products,
    isLoading,
    error: orderError ? orderError.message : null,
  };
};
