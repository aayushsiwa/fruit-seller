import { useCallback, useMemo } from "react";
import { UseMutationResult } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useSnackbar } from "@/src/contexts/SnackBarContext";
import {
    AdminActionsProps,
    UseAdminActionsReturn,
} from "@/types/admin";
import { ItemType, User } from "@/types/index";
import { productSchema, userSchema } from "@/lib/validation/admin";


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
            resetForm?: () => void
        ) => {
            try {
                await mutation.mutateAsync(data);
                showSnackbar(successMessage, "success");
                closeDialog();
                resetForm?.();
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : "An error occurred";
                setError(errorMessage);
                showSnackbar(errorMessage, "error");
            }
        },
        [setError, showSnackbar]
    );

    const productFormik = useFormik({
        initialValues: {
            name: isEditProduct ? selectedProduct?.name || "" : "",
            price: isEditProduct ? selectedProduct?.price || 0 : 0,
            description: isEditProduct
                ? selectedProduct?.description || ""
                : "",
            discount: isEditProduct ? selectedProduct?.discount || 0 : 0,
            isSeasonal: isEditProduct
                ? selectedProduct?.isSeasonal || false
                : false,
            category: isEditProduct ? selectedProduct?.category || "" : "",
            quantity: isEditProduct ? selectedProduct?.quantity || 0 : 0,
            image: isEditProduct ? selectedProduct?.image || "" : "",
        },
        validationSchema: productSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const productData: Partial<ItemType> = {
                ...values,
                image: values.image || undefined,
            };
            console.log("productData", productData);

            await handleMutation(
                saveProductMutation,
                { productData, isEdit: isEditProduct, id: selectedProduct?.id },
                handleCloseProductDialog,
                isEditProduct
                    ? "Product updated successfully"
                    : "Product added successfully",
                productFormik.resetForm
            );
        },
    });

    const userFormik = useFormik({
        initialValues: {
            firstName: isEditUser ? selectedUser?.firstName || "" : "",
            lastName: isEditUser ? selectedUser?.lastName || "" : "",
            email: isEditUser ? selectedUser?.email || "" : "",
            role: isEditUser ? selectedUser?.role || "" : "",
        },
        validationSchema: userSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const userData: Partial<
                Pick<User, "firstName" | "lastName" | "email" | "role">
            > = {
                ...values,
            };

            await handleMutation(
                saveUserMutation,
                { userData, isEdit: isEditUser, id: selectedUser?.id },
                handleCloseUserDialog,
                isEditUser
                    ? "User updated successfully"
                    : "User added successfully",
                userFormik.resetForm
            );
        },
    });

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
            handleSaveProduct: async () => {
                await productFormik.handleSubmit();
            },
            handleDeleteProduct,
            handleSaveUser: async () => {
                await userFormik.handleSubmit();
            },
            handleDeleteUser,
            handleUpdateOrderStatus,
        }),
        [
            productFormik,
            userFormik,
            handleDeleteProduct,
            handleDeleteUser,
            handleUpdateOrderStatus,
        ]
    );
};
