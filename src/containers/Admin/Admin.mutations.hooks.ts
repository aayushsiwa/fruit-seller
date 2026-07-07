import {
  deleteProduct,
  deleteUser,
  saveProduct,
  saveUser,
  updateOrderStatus,
} from '@/lib/adminApi';
import { UseAdminMutationsReturn } from '@/types/admin';
import { ItemType, OrderStatus, User } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAdminMutations = (): UseAdminMutationsReturn => {
  const queryClient = useQueryClient();

  const saveProductMutation = useMutation({
    mutationFn: ({
      productData,
      isEdit,
      id,
    }: {
      productData: Partial<ItemType>;
      isEdit: boolean;
      id?: string;
    }) => saveProduct(productData, isEdit, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  const saveUserMutation = useMutation({
    mutationFn: ({
      userData,
      isEdit,
      id,
    }: {
      userData: Partial<User>;
      isEdit: boolean;
      id?: string;
    }) => saveUser(userData, isEdit, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({
      id,
      status,
      shipped_at,
      delivered_at,
      cancelled_at,
    }: {
      id: string;
      status: OrderStatus;
      shipped_at?: string;
      delivered_at?: string;
      cancelled_at?: string;
    }) => updateOrderStatus(id, status, shipped_at, delivered_at, cancelled_at),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
    },
  });

  return {
    saveProductMutation,
    deleteProductMutation,
    saveUserMutation,
    deleteUserMutation,
    updateOrderMutation,
  };
};
