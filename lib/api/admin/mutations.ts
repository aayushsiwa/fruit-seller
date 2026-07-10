import { IProduct } from '@/entity/Products/Products';
import { User } from '@/entity/Users/Users';
import { Order, OrderStatus, User as UserType } from '@/types/index';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// --- Products ---

export type SaveProductVars = {
  productData: Partial<IProduct>;
  isEdit: boolean;
  id?: string;
};

export const saveProductAPI = async (
  vars: SaveProductVars
): Promise<IProduct> => {
  const url = vars.isEdit ? `/api/products/${vars.id}` : '/api/products';
  const response = vars.isEdit
    ? await axios.put<IProduct>(url, vars.productData)
    : await axios.post<IProduct>(url, vars.productData);
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
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
};

export const updateOrderStatusAPI = async (
  vars: UpdateOrderVars
): Promise<Order> => {
  const response = await axios.put<Order>(`/api/admin/orders/${vars.id}`, {
    status: vars.status,
    ...(vars.shipped_at && { shipped_at: vars.shipped_at }),
    ...(vars.delivered_at && { delivered_at: vars.delivered_at }),
    ...(vars.cancelled_at && { cancelled_at: vars.cancelled_at }),
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
