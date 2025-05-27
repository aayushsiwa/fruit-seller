import { useCallback } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { useSnackbar } from "@/src/contexts/SnackBarContext";
import { AdminActionsProps, ItemType, User } from "@/types";
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
}: AdminActionsProps) => {
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
                price: Number(formData.get("price")),
                description: formData.get("description") as string,
                discount: Number(formData.get("discount")) || 0,
                isSeasonal: formData.get("is_seasonal") === "true",
                category: formData.get("category") as string,
                quantity: Number(formData.get("quantity")),
                image: (formData.get("image") as string) || undefined,
            };

            const validation = validateProductData(productData);
            if (!validation.isValid) {
                setError(validation.error ?? null);
                showSnackbar(validation.error!, "error");
                return;
            }

            await handleMutation(
                saveProductMutation,
                { productData, isEdit: isEditProduct, id: selectedProduct.id },
                handleCloseProductDialog,
                isEditProduct
                    ? "Product updated successfully"
                    : "Product added successfully"
            );
        },
        [
            handleMutation,
            saveProductMutation,
            isEditProduct,
            selectedProduct.id,
            handleCloseProductDialog,
            setError,
            showSnackbar,
        ]
    );

    const handleDeleteProduct = useCallback(async () => {
        if (!selectedProduct.id) {
            setError("No product selected");
            showSnackbar("No product selected", "error");
            return;
        }

        await handleMutation(
            deleteProductMutation,
            selectedProduct.id,
            handleCloseDeleteDialog,
            "Product deleted successfully"
        );
    }, [
        selectedProduct.id,
        handleMutation,
        deleteProductMutation,
        handleCloseDeleteDialog,
        setError,
        showSnackbar,
    ]);

    const handleSaveUser = useCallback(
        async (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            const userData: Partial<User> = {
                firstName: formData.get("firstName") as string,
                lastName: formData.get("lastName") as string,
                email: formData.get("email") as string,
                role: formData.get("role") as string,
            };

            const validation = validateUserData(userData);
            if (!validation.isValid) {
                setError(validation.error ?? null);
                showSnackbar(validation.error!, "error");
                return;
            }

            await handleMutation(
                saveUserMutation,
                { userData, isEdit: isEditUser, id: selectedUser.id },
                handleCloseUserDialog,
                isEditUser
                    ? "User updated successfully"
                    : "User added successfully"
            );
        },
        [
            handleMutation,
            saveUserMutation,
            isEditUser,
            selectedUser.id,
            handleCloseUserDialog,
            setError,
            showSnackbar,
        ]
    );

    const handleDeleteUser = useCallback(async () => {
        if (!selectedUser.id) {
            setError("No user selected");
            showSnackbar("No user selected", "error");
            return;
        }

        await handleMutation(
            deleteUserMutation,
            selectedUser.id,
            handleCloseUserDeleteDialog,
            "User deleted successfully"
        );
    }, [
        selectedUser.id,
        handleMutation,
        deleteUserMutation,
        handleCloseUserDeleteDialog,
        setError,
        showSnackbar,
    ]);

    const handleUpdateOrderStatus = useCallback(
        async (status: string) => {
            if (!selectedOrder.id) {
                setError("No order selected");
                showSnackbar("No order selected", "error");
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
            selectedOrder.id,
            handleMutation,
            updateOrderMutation,
            handleCloseOrderDialog,
            setError,
            showSnackbar,
        ]
    );

    return {
        handleSaveProduct,
        handleDeleteProduct,
        handleSaveUser,
        handleDeleteUser,
        handleUpdateOrderStatus,
    };
};
