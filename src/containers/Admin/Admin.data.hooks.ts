import { fetchOrders, fetchProducts, fetchUsers } from '@/lib/adminApi';
import { UseAdminDataReturn } from '@/types/admin';
import { useQuery } from '@tanstack/react-query';

export const useAdminData = (isAdmin: boolean): UseAdminDataReturn => {
  const productsQuery = useQuery({
    queryKey: ['adminProducts'],
    queryFn: fetchProducts,
    enabled: isAdmin,
  });

  const usersQuery = useQuery({
    queryKey: ['adminUsers'],
    queryFn: fetchUsers,
    enabled: isAdmin,
  });

  const ordersQuery = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchOrders,
    enabled: isAdmin,
  });

  return {
    products: productsQuery.data,
    users: usersQuery.data,
    orders: ordersQuery.data,
    isLoadingProducts: productsQuery.isLoading,
    isLoadingUsers: usersQuery.isLoading,
    isLoadingOrders: ordersQuery.isLoading,
    productsError: productsQuery.error,
    usersError: usersQuery.error,
    ordersError: ordersQuery.error,
  };
};
