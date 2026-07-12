import { validateProductData, validateUserData } from '@/lib/validation/admin';
import { useSnackbar } from '@/src/contexts/SnackBarContext';
import { AdminActionsProps, UseAdminActionsReturn } from '@/types/admin';
import { IProduct, OrderStatus, ProductImage, User, UserRole } from '@/types/index';
import { UseMutationResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

const STATUS_ORDER: OrderStatus[] = ['PROCESSING', 'SHIPPED', 'DELIVERED'];

function validateTransition(
  current: OrderStatus,
  next: OrderStatus
): string | null {
  if (current === next) return null;
  if (current === 'DELIVERED' || current === 'CANCELLED') {
    return `Cannot change status from "${current}" — it is a terminal state`;
  }
  if (next === 'PROCESSING') return 'Cannot revert to PROCESSING';
  const currentIdx = STATUS_ORDER.indexOf(current);
  const nextIdx = STATUS_ORDER.indexOf(next);
  if (nextIdx >= 0 && nextIdx <= currentIdx) {
    return `Cannot revert from "${current}" to "${next}"`;
  }
  return null;
}

const useAdminActions = ({
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
}: AdminActionsProps): UseAdminActionsReturn => {
  const { showSnackbar } = useSnackbar();

  const handleMutation = useCallback(
    async <TData, TVariables>(
      mutation: UseMutationResult<TData, Error, TVariables, unknown>,
      data: TVariables,
      closeDialog: () => void,
      successMessage: string
    ) => {
      try {
        await mutation.mutateAsync(data);
        showSnackbar(successMessage, 'success');
        closeDialog();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        showSnackbar(errorMessage, 'error');
      }
    },
    [setError, showSnackbar]
  );

  const handleSaveProduct = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const imagesRaw = formData.get('images') as string;
      const productData: Partial<IProduct> = {
        name: formData.get('name') as string,
        price: parseFloat(formData.get('price') as string),
        description: formData.get('description') as string,
        discount: parseInt(formData.get('discount') as string, 10) || 0,
        isSeasonal: formData.get('isSeasonal') === 'true',
        category: formData.get('category') as string,
        stock: parseInt(formData.get('stock') as string, 10) || 0,
        images: imagesRaw ? (JSON.parse(imagesRaw) as ProductImage[]) : [],
      };

      const { isValid, error } = validateProductData(productData);
      if (!isValid) {
        setError(error || 'Validation failed');
        showSnackbar(error || 'Validation failed', 'error');
        return;
      }

      await handleMutation(
        saveProductMutation,
        { productData, isEdit: isEditProduct, id: selectedProduct?.ID },
        handleCloseProductDialog,
        isEditProduct
          ? 'Product updated successfully'
          : 'Product added successfully'
      );
    },
    [
      saveProductMutation,
      isEditProduct,
      selectedProduct?.ID,
      handleCloseProductDialog,
      handleMutation,
      setError,
      showSnackbar,
    ]
  );

  const handleSaveUser = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      const userData: Partial<
        Pick<User, 'firstName' | 'lastName' | 'email' | 'role'>
      > = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        email: formData.get('email') as string,
        role: formData.get('role') as UserRole,
      };

      const { isValid, error } = validateUserData(userData);
      if (!isValid) {
        setError(error || 'Validation failed');
        showSnackbar(error || 'Validation failed', 'error');
        return;
      }

      await handleMutation(
        saveUserMutation,
        { userData, isEdit: isEditUser, id: selectedUser?.ID },
        handleCloseUserDialog,
        isEditUser ? 'User updated successfully' : 'User added successfully'
      );
    },
    [
      saveUserMutation,
      isEditUser,
      selectedUser?.ID,
      handleCloseUserDialog,
      handleMutation,
      setError,
      showSnackbar,
    ]
  );

  const handleDeleteProduct = useCallback(async () => {
    if (!selectedProduct?.ID) {
      const error = 'No product selected';
      setError(error);
      showSnackbar(error, 'error');
      return;
    }

    await handleMutation(
      deleteProductMutation,
      selectedProduct.id,
      handleCloseDeleteDialog,
      'Product deleted successfully'
    );
  }, [
    selectedProduct?.ID,
    handleMutation,
    deleteProductMutation,
    handleCloseDeleteDialog,
    setError,
    showSnackbar,
  ]);

  const handleDeleteUser = useCallback(async () => {
    if (!selectedUser?.ID) {
      const error = 'No user selected';
      setError(error);
      showSnackbar(error, 'error');
      return;
    }

    await handleMutation(
      deleteUserMutation,
      selectedUser.id,
      handleCloseUserDeleteDialog,
      'User deleted successfully'
    );
  }, [
    selectedUser?.ID,
    handleMutation,
    deleteUserMutation,
    handleCloseUserDeleteDialog,
    setError,
    showSnackbar,
  ]);

  const handleUpdateOrderStatus = useCallback(
    async (status: OrderStatus) => {
      const currentStatus = selectedOrder?.status as OrderStatus | undefined;
      if (!currentStatus) {
        const error = 'No order status available';
        setError(error);
        showSnackbar(error, 'error');
        return;
      }

      const validationError = validateTransition(currentStatus, status);
      if (validationError) {
        setError(validationError);
        showSnackbar(validationError, 'error');
        return;
      }

      handleOpenConfirmDialog(status);
    },
    [selectedOrder?.status, setError, showSnackbar, handleOpenConfirmDialog]
  );

  const handleConfirmOrderStatus = useCallback(async () => {
    if (!selectedOrder?.ID) {
      const error = 'No order selected';
      setError(error);
      showSnackbar(error, 'error');
      return;
    }

    const now = new Date().toISOString();
    await handleMutation(
      updateOrderMutation,
      {
        id: selectedOrder.ID.toString(),
        status: confirmStatus,
        shippedAt: confirmStatus === 'SHIPPED' ? now : undefined,
        deliveredAt: confirmStatus === 'DELIVERED' ? now : undefined,
        cancelledAt: confirmStatus === 'CANCELLED' ? now : undefined,
      },
      () => {
        handleCloseConfirmDialog();
        handleCloseOrderDialog();
      },
      'Order status updated successfully'
    );
  }, [
    selectedOrder?.ID,
    updateOrderMutation,
    confirmStatus,
    handleMutation,
    handleCloseConfirmDialog,
    handleCloseOrderDialog,
    setError,
    showSnackbar,
  ]);

  return useMemo(
    () => ({
      handleSaveProduct,
      handleDeleteProduct,
      handleSaveUser,
      handleDeleteUser,
      handleUpdateOrderStatus,
      handleConfirmOrderStatus,
    }),
    [
      handleSaveProduct,
      handleDeleteProduct,
      handleSaveUser,
      handleDeleteUser,
      handleUpdateOrderStatus,
      handleConfirmOrderStatus,
    ]
  );
};

export { useAdminActions };
