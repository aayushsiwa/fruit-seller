import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemType, User } from "@/types";
import { saveProduct, deleteProduct, saveUser, deleteUser, updateOrderStatus } from "@/pages/api/adminApi";

export const useAdminMutations = () => {
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
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
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
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
        },
    });

    const updateOrderMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
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