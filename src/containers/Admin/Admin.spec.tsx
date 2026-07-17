import { mockShowSnackbar, renderHook } from '@/src/utils/test';
import { AdminActionsProps } from '@/types/admin';
import { UseMutationResult } from '@tanstack/react-query';
import React from 'react';

import { useAdminActions } from './Admin.hooks';

describe('Admin - Hooks', () => {
  describe('useAdminActions - handleSaveUser', () => {
    it('should call mutateAsync, show success snackbar and close dialog', async () => {
      const mutateAsync = vi.fn().mockResolvedValue({});
      const setError = vi.fn();
      const handleCloseUserDialog = vi.fn();

      const props = {
        saveProductMutation: {} as UseMutationResult,
        deleteProductMutation: {} as UseMutationResult,
        saveUserMutation: { mutateAsync } as unknown as UseMutationResult,
        deleteUserMutation: {} as UseMutationResult,
        updateOrderMutation: {} as UseMutationResult,
        selectedProduct: { ID: '1' },
        selectedUser: { ID: 'user123' },
        selectedOrder: { ID: 'order123' },
        isEditProduct: false,
        isEditUser: false,
        handleCloseProductDialog: vi.fn(),
        handleCloseDeleteDialog: vi.fn(),
        handleCloseUserDialog,
        handleCloseUserDeleteDialog: vi.fn(),
        handleCloseOrderDialog: vi.fn(),
        setError,
        handleOpenConfirmDialog: vi.fn(),
        handleCloseConfirmDialog: vi.fn(),
        confirmStatus: 'PROCESSING' as const,
      };

      const { result } = renderHook(() =>
        useAdminActions(props as AdminActionsProps)
      );

      const form = document.createElement('form');
      const addInput = (name: string, value: string) => {
        const input = document.createElement('input');
        input.name = name;
        input.value = value;
        form.appendChild(input);
      };
      addInput('firstName', 'John');
      addInput('lastName', 'Doe');
      addInput('email', 'john@example.com');
      addInput('role', 'ADMIN');

      const formEvent = {
        preventDefault: vi.fn(),
        currentTarget: form,
      } as unknown as React.FormEvent<HTMLFormElement>;

      await result.current.handleSaveUser(formEvent);

      expect(mutateAsync).toHaveBeenCalledWith({
        userData: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          role: 'ADMIN',
        },
        isEdit: false,
        id: 'user123',
      });

      expect(mockShowSnackbar).toHaveBeenCalledWith(
        'User added successfully',
        'success'
      );
      expect(handleCloseUserDialog).toHaveBeenCalled();
      expect(setError).not.toHaveBeenCalled();
    });
  });
});
