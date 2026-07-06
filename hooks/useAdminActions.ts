import { useCallback, useMemo } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { useSnackbar } from "@/src/contexts/SnackBarContext";
import {
    AdminActionsProps,
    UseAdminActionsReturn,
} from "@/types/admin";
import { ItemType, User } from "@/types/index";
import { validateProductData, validateUserData } from "@/lib/validation/admin";


export const useAdminActions = ({
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
}: AdminActionsProps): UseAdminActionsReturn => {
    const { showSnackbar } = useSnackbar();

    const handleMutation = useCallback(
        async <TData, TVariables>(
            mutation: UseMutationResult<TData, Error, TVariables, unknown>,
            data: TVariables,
            closeDialog: () => void,
            successMessage: string,
        ) => {
            try {
                await mutation.mutateAsync(data);
                showSnackbar(successMessage, "success");
                closeDialog();
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "An error occurred";
                setError(errorMessage);
                showSnackbar(errorMessage, "error");
            }
        },
        [setError, showSnackbar]
    );

    const handleSaveProduct = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const productData: Partial<ItemType> = {
                name: formData.get("name") as string,
                price: parseFloat(formData.get("price") as string),
                description: formData.get("description") as string,
                discount: parseInt(formData.get("discount") as string, 10) || 0,
                isSeasonal: formData.get("isSeasonal") === "true",
                category: formData.get("category") as string,
                quantity: parseInt(formData.get("quantity") as string, 10) || 0,
                image: (formData.get("image") as string) || undefined,
            };

            const { isValid, error } = validateProductData(productData);
            if (!isValid) {
                setError(error || "Validation failed");
                showSnackbar(error || "Validation failed", "error");
                return;
            }

            await handleMutation(
                saveProductMutation,
                { productData, isEdit: isEditProduct, id: selectedProduct?.id },
                handleCloseProductDialog,
                isEditProduct
                    ? "Product updated successfully"
                    : "Product added successfully",
            );
        },
        [
            saveProductMutation,
            isEditProduct,
            selectedProduct?.id,
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
                Pick<User, "firstName" | "lastName" | "email" | "role">
            > = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as string,
            };

            const { isValid, error } = validateUserData(userData);
            if (!isValid) {
                setError(error || "Validation failed");
                showSnackbar(error || "Validation failed", "error");
                return;
            }

            await handleMutation(
                saveUserMutation,
                { userData, isEdit: isEditUser, id: selectedUser?.id },
                handleCloseUserDialog,
                isEditUser
                    ? "User updated successfully"
                    : "User added successfully",
            );
        },
        [
            saveUserMutation,
            isEditUser,
            selectedUser?.id,
            handleCloseUserDialog,
            handleMutation,
            setError,
            showSnackbar,
        ]
    );

    const handleDeleteProduct = useCallback(async () => {
        if (!selectedProduct?.id) {
            const error = "No product selected";
            setError(error);
            showSnackbar(error, "error");
            return;
        }

        await handleMutation(
            deleteProductMutation,
            selectedProduct.id,
            handleCloseDeleteDialog,
            "Product deleted successfully"
        );
    }, [
        selectedProduct?.id,
        handleMutation,
        deleteProductMutation,
        handleCloseDeleteDialog,
        setError,
        showSnackbar,
    ]);

    const handleDeleteUser = useCallback(async () => {
        if (!selectedUser?.id) {
            const error = "No user selected";
            setError(error);
            showSnackbar(error, "error");
            return;
        }

        await handleMutation(
            deleteUserMutation,
            selectedUser.id,
            handleCloseUserDeleteDialog,
            "User deleted successfully"
        );
    }, [
        selectedUser?.id,
        handleMutation,
        deleteUserMutation,
        handleCloseUserDeleteDialog,
        setError,
        showSnackbar,
    ]);

    const handleUpdateOrderStatus = useCallback(
        async (status: string) => {
            if (!selectedOrder?.id) {
                const error = "No order selected";
                setError(error);
                showSnackbar(error, "error");
                return;
            }

            await handleMutation(
                updateOrderMutation,
                { id: selectedOrder.id.toString(), status },
                handleCloseOrderDialog,
                "Order status updated successfully"
            );
        },
        [
            selectedOrder?.id,
            handleMutation,
            updateOrderMutation,
            handleCloseOrderDialog,
            setError,
            showSnackbar,
        ]
    );

    return useMemo(
        () => ({
            handleSaveProduct,
            handleDeleteProduct,
            handleSaveUser,
            handleDeleteUser,
            handleUpdateOrderStatus,
        }),
        [
            handleSaveProduct,
            handleDeleteProduct,
            handleSaveUser,
            handleDeleteUser,
            handleUpdateOrderStatus,
        ]
    );
};
