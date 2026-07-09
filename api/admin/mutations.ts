import { IProduct } from '@/entity/Products/Products';
import { User } from '@/entity/Users/Users';
import { Order, OrderStatus, User as UserType } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

type SaveProductVars = {
  productData: Partial<IProduct>;
  isEdit: boolean;
  id?: string;
};
type SaveUserVars = { userData: Partial<User>; isEdit: boolean; id?: string };
type UpdateOrderVars = {
  id: string;
  status: OrderStatus;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
};

export const useSaveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: SaveProductVars) => {
      const url = vars.isEdit ? `/api/products/${vars.id}` : '/api/products';
      const response = vars.isEdit
        ? await axios.put<IProduct>(url, vars.productData)
        : await axios.post<IProduct>(url, vars.productData);
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/products/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
  });
};

export const useSaveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: SaveUserVars) => {
      const url = vars.isEdit
        ? `/api/admin/users/${vars.id}`
        : '/api/admin/users';
      const response = vars.isEdit
        ? await axios.put<UserType>(url, vars.userData)
        : await axios.post<UserType>(url, vars.userData);
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/admin/users/${id}`);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (vars: UpdateOrderVars) => {
      const response = await axios.put<Order>(`/api/admin/orders/${vars.id}`, {
        status: vars.status,
        ...(vars.shipped_at && { shipped_at: vars.shipped_at }),
        ...(vars.delivered_at && { delivered_at: vars.delivered_at }),
        ...(vars.cancelled_at && { cancelled_at: vars.cancelled_at }),
      });
      return response.data;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] }),
  });
};
