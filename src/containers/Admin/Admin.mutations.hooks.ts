import {
  useDeleteProduct,
  useDeleteUser,
  useSaveProduct,
  useSaveUser,
  useUpdateOrderStatus,
} from '@/lib/api/admin/mutations';
import { UseAdminMutationsReturn } from '@/types/admin';

export const useAdminMutations = (): UseAdminMutationsReturn => {
  const saveProductMutation = useSaveProduct();
  const deleteProductMutation = useDeleteProduct();
  const saveUserMutation = useSaveUser();
  const deleteUserMutation = useDeleteUser();
  const updateOrderMutation = useUpdateOrderStatus();

  return {
    saveProductMutation,
    deleteProductMutation,
    saveUserMutation,
    deleteUserMutation,
    updateOrderMutation,
  };
};
