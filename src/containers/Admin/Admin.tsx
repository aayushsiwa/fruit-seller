import DashboardStats from '@/src/components/admin/DashboardStats';
import OrdersTab from '@/src/components/admin/OrdersTab';
import ProductsTab from '@/src/components/admin/ProductsTab';
import UsersTab from '@/src/components/admin/UsersTab';
import ConfirmDeleteDialog from '@/src/components/admin/dialogs/ConfirmDeleteDialog';
import ConfirmStatusDialog from '@/src/components/admin/dialogs/ConfirmStatusDialog';
import OrderDialog from '@/src/components/admin/dialogs/OrderDialog';
import ProductDialog from '@/src/components/admin/dialogs/ProductDialog';
import UserDialog from '@/src/components/admin/dialogs/UserDialog';
import { useAuth } from '@/src/contexts/AuthContext';
import { TabValue } from '@/types/index';
import {
  Box,
  Container,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import {
  useAdminActions,
  useAdminDashboard,
  useAdminData,
  useAdminDialogs,
  useAdminMutations,
} from './Admin.hooks';

export default function AdminDashboard() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { activeTab, searchQuery, setSearchQuery, handleTabChange } =
    useAdminDashboard();
  const { isAdmin } = useAuth();
  const {
    products,
    users,
    orders,
    isLoadingProducts,
    isLoadingUsers,
    isLoadingOrders,
    productsError,
    usersError,
    ordersError,
  } = useAdminData(isAdmin());
  const {
    saveProductMutation,
    deleteProductMutation,
    saveUserMutation,
    deleteUserMutation,
    updateOrderMutation,
  } = useAdminMutations();
  const {
    openProductDialog,
    openDeleteDialog,
    openUserDialog,
    openUserDeleteDialog,
    openOrderDialog,
    selectedProduct,
    selectedUser,
    selectedOrder,
    error,
    setError,
    isEditProduct,
    isEditUser,
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
    setSelectedOrder,
    openConfirmDialog,
    confirmStatus,
    handleOpenConfirmDialog,
    handleCloseConfirmDialog,
  } = useAdminDialogs();
  const {
    handleSaveProduct,
    handleDeleteProduct,
    handleSaveUser,
    handleDeleteUser,
    handleUpdateOrderStatus,
    handleConfirmOrderStatus,
  } = useAdminActions({
    saveProductMutation,
    deleteProductMutation,
    saveUserMutation,
    deleteUserMutation,
    updateOrderMutation,
    selectedProduct,
    selectedUser,
    selectedOrder,
    isEditProduct,
    isEditUser,
    handleCloseProductDialog,
    handleCloseDeleteDialog,
    handleCloseUserDialog,
    handleCloseUserDeleteDialog,
    handleCloseOrderDialog,
    setError,
    handleOpenConfirmDialog,
    handleCloseConfirmDialog,
    confirmStatus,
  });

  useEffect(() => {
    if (!isAdmin()) {
      router.push('/');
    }
  }, [isAdmin, router]);

  const transformError = (err: unknown): string | null =>
    err instanceof Error ? err.message : typeof err === 'string' ? err : null;

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage your products, users, and orders
        </Typography>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>

      <DashboardStats
        products={products ?? []}
        users={users ?? []}
        orders={orders ?? []}
        isLoadingProducts={isLoadingProducts}
        isLoadingUsers={isLoadingUsers}
        isLoadingOrders={isLoadingOrders}
      />

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons={isMobile}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Products" />
          <Tab label="Users" />
          <Tab label="Orders" />
        </Tabs>
      </Box>

      {activeTab === TabValue.PRODUCTS && (
        <ProductsTab
          products={products ?? []}
          isLoading={isLoadingProducts}
          error={transformError(productsError)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddProduct={handleOpenProductDialog}
          onEditProduct={handleOpenProductDialog}
          onDeleteProduct={handleOpenDeleteDialog}
        />
      )}

      {activeTab === TabValue.USERS && (
        <UsersTab
          users={users ?? []}
          isLoading={isLoadingUsers}
          error={transformError(usersError)}
          onAddUser={handleOpenUserDialog}
          onEditUser={handleOpenUserDialog}
          onDeleteUser={handleOpenUserDeleteDialog}
        />
      )}

      {activeTab === TabValue.ORDERS && (
        <OrdersTab
          orders={orders ?? []}
          isLoading={isLoadingOrders}
          error={transformError(ordersError)}
          onEditOrder={handleOpenOrderDialog}
        />
      )}

      <ProductDialog
        open={openProductDialog}
        product={selectedProduct}
        onClose={handleCloseProductDialog}
        onSave={handleSaveProduct}
        isLoading={saveProductMutation.isPending}
      />

      <UserDialog
        open={openUserDialog}
        user={selectedUser}
        onClose={handleCloseUserDialog}
        onSave={handleSaveUser}
        isLoading={saveUserMutation.isPending}
      />

      <OrderDialog
        open={openOrderDialog}
        order={selectedOrder}
        onClose={handleCloseOrderDialog}
        onUpdateStatus={handleUpdateOrderStatus}
        onOrderChange={setSelectedOrder}
        isLoading={updateOrderMutation.isPending}
      />

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProduct}
        isLoading={deleteProductMutation.isPending}
        entity={selectedProduct}
        entityType="product"
      />

      <ConfirmDeleteDialog
        open={openUserDeleteDialog}
        onClose={handleCloseUserDeleteDialog}
        onConfirm={handleDeleteUser}
        isLoading={deleteUserMutation.isPending}
        entity={selectedUser}
        entityType="user"
      />

      <ConfirmStatusDialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        onConfirm={handleConfirmOrderStatus}
        isLoading={updateOrderMutation.isPending}
        currentStatus={(selectedOrder?.status as string) || 'Processing'}
        newStatus={confirmStatus}
      />
    </Container>
  );
}
