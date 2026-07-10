import { UseAdminDialogsReturn } from '@/types/admin';
import { IProduct, Order, OrderStatus, User } from '@/types/index';
import { useState } from 'react';

export const useAdminDialogs = (): UseAdminDialogsReturn => {
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [openUserDeleteDialog, setOpenUserDeleteDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openOrderDetailsDialog, setOpenOrderDetailsDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | undefined>(
    undefined
  );
  const [confirmStatus, setConfirmStatus] = useState<OrderStatus>('Processing');
  const [selectedProduct, setSelectedProduct] = useState<Partial<IProduct>>({});
  const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
  const [selectedOrder, setSelectedOrder] = useState<Partial<Order>>({});
  const [error, setError] = useState<string | null>(null);
  const [isEditProduct, setIsEditProduct] = useState(false);
  const [isEditUser, setIsEditUser] = useState(false);

  const handleOpenProductDialog = (
    product: Partial<IProduct> | null = null
  ) => {
    setSelectedProduct(product || {});
    setIsEditProduct(!!product?.id);
    setOpenProductDialog(true);
    setError(null);
  };

  const handleCloseProductDialog = () => {
    setOpenProductDialog(false);
    setSelectedProduct({});
    setIsEditProduct(false);
    setError(null);
  };

  const handleOpenDeleteDialog = (product: IProduct) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
    setError(null);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct({});
    setError(null);
  };

  const handleOpenUserDialog = (user: Partial<User> | null = null) => {
    setSelectedUser(user || {});
    setIsEditUser(!!user?.id);
    setOpenUserDialog(true);
    setError(null);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
    setSelectedUser({});
    setIsEditUser(false);
    setError(null);
  };

  const handleOpenUserDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setOpenUserDeleteDialog(true);
    setError(null);
  };

  const handleCloseUserDeleteDialog = () => {
    setOpenUserDeleteDialog(false);
    setSelectedUser({});
    setError(null);
  };

  const handleOpenOrderDialog = (order: Order) => {
    setSelectedOrder(order);
    setOpenOrderDialog(true);
    setError(null);
  };

  const handleCloseOrderDialog = () => {
    setOpenOrderDialog(false);
    setSelectedOrder({});
    setError(null);
  };

  const handleOpenOrderDetailsDialog = (order: Order) => {
    setSelectedOrderId(order.id);
    setOpenOrderDetailsDialog(true);
    setError(null);
  };

  const handleCloseOrderDetailsDialog = () => {
    setOpenOrderDetailsDialog(false);
    setSelectedOrderId(undefined);
    setError(null);
  };

  const handleOpenConfirmDialog = (status: OrderStatus) => {
    setConfirmStatus(status);
    setOpenConfirmDialog(true);
    setError(null);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setConfirmStatus('Processing');
    setError(null);
  };

  return {
    openProductDialog,
    openDeleteDialog,
    openUserDialog,
    openUserDeleteDialog,
    openOrderDialog,
    openConfirmDialog,
    openOrderDetailsDialog,
    confirmStatus,
    selectedProduct,
    selectedUser,
    selectedOrder,
    selectedOrderId,
    error,
    setError,
    isEditProduct,
    isEditUser,
    setSelectedOrder,
    handleOpenProductDialog,
    handleCloseProductDialog,
    handleOpenDeleteDialog,
    handleCloseDeleteDialog,
    handleOpenUserDialog,
    handleCloseUserDialog,
    handleOpenUserDeleteDialog,
    handleCloseUserDeleteDialog,
    handleOpenOrderDialog,
    handleCloseOrderDialog,
    handleOpenOrderDetailsDialog,
    handleCloseOrderDetailsDialog,
    handleOpenConfirmDialog,
    handleCloseConfirmDialog,
  };
};
