import { IProduct } from '@/entity/Products/Products';
import { User } from '@/entity/Users/Users';
import { Order, OrderStatus, User as UserType } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// --- Products ---

export type SaveProductVars = {
  productData: Partial<IProduct>;
  isEdit: boolean;
  id?: string;
};

export const saveProductAPI = async (
  vars: SaveProductVars
): Promise<IProduct> => {
  const data = { ...vars.productData };
  if (data.name) {
    data.slug = toSlug(data.name);
  }
  const url = vars.isEdit ? `/api/products/${vars.id}` : '/api/products';
  const response = vars.isEdit
    ? await axios.put<IProduct>(url, data)
    : await axios.post<IProduct>(url, data);
  return response.data;
};

export const deleteProductAPI = async (id: string): Promise<void> => {
  await axios.delete(`/api/products/${id}`);
};

export const useSaveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveProductAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminProducts'] }),
  });
};

// --- Users ---

export type SaveUserVars = {
  userData: Partial<User>;
  isEdit: boolean;
  id?: string;
};

export const saveUserAPI = async (vars: SaveUserVars): Promise<UserType> => {
  const url = vars.isEdit ? `/api/admin/users/${vars.id}` : '/api/admin/users';
  const response = vars.isEdit
    ? await axios.put<UserType>(url, vars.userData)
    : await axios.post<UserType>(url, vars.userData);
  return response.data;
};

export const deleteUserAPI = async (id: string): Promise<void> => {
  await axios.delete(`/api/admin/users/${id}`);
};

export const useSaveUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveUserAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] }),
  });
};

// --- Orders ---

export type UpdateOrderVars = {
  id: string;
  status: OrderStatus;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
};

export const updateOrderStatusAPI = async (
  vars: UpdateOrderVars
): Promise<Order> => {
  const response = await axios.put<Order>(`/api/admin/orders/${vars.id}`, {
    status: vars.status,
    ...(vars.shippedAt && { shippedAt: vars.shippedAt }),
    ...(vars.deliveredAt && { deliveredAt: vars.deliveredAt }),
    ...(vars.cancelledAt && { cancelledAt: vars.cancelledAt }),
  });
  return response.data;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateOrderStatusAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] }),
  });
};
