import { useGetAdminOrders } from '@/api/admin/getAdminOrders';
import { useGetAdminProducts } from '@/api/admin/getAdminProducts';
import { useGetAdminUsers } from '@/api/admin/getAdminUsers';
import { UseAdminDataReturn } from '@/types/admin';

export const useAdminData = (isAdmin: boolean): UseAdminDataReturn => {
  const productsQuery = useGetAdminProducts(isAdmin);
  const usersQuery = useGetAdminUsers(isAdmin);
  const ordersQuery = useGetAdminOrders(isAdmin);

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
