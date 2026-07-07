import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient, UseMutationResult } from "@tanstack/react-query";
import { useSnackbar } from "@/src/contexts/SnackBarContext";
import { ItemType, User, Order, OrderStatus, TabValue, ORDER_STATUSES } from "@/types/index";
import { AdminActionsProps, UseAdminActionsReturn, UseAdminDataReturn, UseAdminDialogsReturn, UseAdminMutationsReturn, UseAdminDashboardReturn } from "@/types/admin";
import { validateProductData, validateUserData } from "@/lib/validation/admin";
import { fetchProducts, fetchUsers, fetchOrders, saveProduct, deleteProduct, saveUser, deleteUser, updateOrderStatus } from "@/pages/api/adminApi";

const STATUS_ORDER: OrderStatus[] = ["Processing", "Shipped", "Delivered"];

function validateTransition(current: OrderStatus, next: OrderStatus): string | null {
    if (current === next) return null;
    if (current === "Delivered" || current === "Cancelled") {
        return `Cannot change status from "${current}" — it is a terminal state`;
    }
    if (next === "Processing") return "Cannot revert to Processing";
    const currentIdx = STATUS_ORDER.indexOf(current);
    const nextIdx = STATUS_ORDER.indexOf(next);
    if (nextIdx >= 0 && nextIdx <= currentIdx) {
        return `Cannot revert from "${current}" to "${next}"`;
    }
    return null;
}

export const useAdminData = (isAdmin: boolean): UseAdminDataReturn => {
    const productsQuery = useQuery({
        queryKey: ["adminProducts"],
        queryFn: fetchProducts,
        enabled: isAdmin,
    });

    const usersQuery = useQuery({
        queryKey: ["adminUsers"],
        queryFn: fetchUsers,
        enabled: isAdmin,
    });

    const ordersQuery = useQuery({
        queryKey: ["adminOrders"],
        queryFn: fetchOrders,
        enabled: isAdmin,
    });

    return {
        products: productsQuery.data,
        users: usersQuery.data,
        orders: ordersQuery.data,
        isLoadingProducts: productsQuery.isLoading,
        isLoadingUsers: usersQuery.isLoading,
        isLoadingOrders: ordersQuery.isLoading,
        productsError: productsQuery.error,
        usersError: usersQuery.error,
        ordersError: ordersQuery.error,
    };
};

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
        [setError, showSnackbar],
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
        ],
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
                isEditUser ? "User updated successfully" : "User added successfully",
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
        ],
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
            "Product deleted successfully",
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
            "User deleted successfully",
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
        async (status: OrderStatus) => {
            const currentStatus = selectedOrder?.status as OrderStatus | undefined;
            if (!currentStatus) {
                const error = "No order status available";
                setError(error);
                showSnackbar(error, "error");
                return;
            }

            const validationError = validateTransition(currentStatus, status);
            if (validationError) {
                setError(validationError);
                showSnackbar(validationError, "error");
                return;
            }

            handleOpenConfirmDialog(status);
        },
        [
            selectedOrder?.status,
            setError,
            showSnackbar,
            handleOpenConfirmDialog,
        ],
    );

    const handleConfirmOrderStatus = useCallback(async () => {
        if (!selectedOrder?.id) {
            const error = "No order selected";
            setError(error);
            showSnackbar(error, "error");
            return;
        }

        const now = new Date().toISOString();
        await handleMutation(
            updateOrderMutation,
            {
                id: selectedOrder.id.toString(),
                status: confirmStatus,
                shipped_at: confirmStatus === "Shipped" ? now : undefined,
                delivered_at: confirmStatus === "Delivered" ? now : undefined,
                cancelled_at: confirmStatus === "Cancelled" ? now : undefined,
            },
            () => {
                handleCloseConfirmDialog();
                handleCloseOrderDialog();
            },
            "Order status updated successfully",
        );
    }, [
        selectedOrder?.id,
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
        ],
    );
};

export { useAdminActions };

export const useAdminDialogs = (): UseAdminDialogsReturn => {
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openUserDeleteDialog, setOpenUserDeleteDialog] = useState(false);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [confirmStatus, setConfirmStatus] = useState<OrderStatus>("Processing");
    const [selectedProduct, setSelectedProduct] = useState<Partial<ItemType>>(
        {}
    );
    const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
    const [selectedOrder, setSelectedOrder] = useState<Partial<Order>>({});
    const [error, setError] = useState<string | null>(null);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [isEditUser, setIsEditUser] = useState(false);

    const handleOpenProductDialog = (
        product: Partial<ItemType> | null = null
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

    const handleOpenDeleteDialog = (product: ItemType) => {
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

    const handleOpenConfirmDialog = (status: OrderStatus) => {
        setConfirmStatus(status);
        setOpenConfirmDialog(true);
        setError(null);
    };

    const handleCloseConfirmDialog = () => {
        setOpenConfirmDialog(false);
        setConfirmStatus("Processing");
        setError(null);
    };

    return {
        openProductDialog,
        openDeleteDialog,
        openUserDialog,
        openUserDeleteDialog,
        openOrderDialog,
        openConfirmDialog,
        confirmStatus,
        selectedProduct,
        selectedUser,
        selectedOrder,
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
        handleOpenConfirmDialog,
        handleCloseConfirmDialog,
    };
};

export const useAdminMutations = (): UseAdminMutationsReturn => {
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
    mutationFn: ({
      id,
      status,
      shipped_at,
      delivered_at,
      cancelled_at,
    }: {
      id: string;
      status: OrderStatus;
      shipped_at?: string;
      delivered_at?: string;
      cancelled_at?: string;
    }) => updateOrderStatus(id, status, shipped_at, delivered_at, cancelled_at),
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

export const useAdminDashboard = (): UseAdminDashboardReturn => {
    const [activeTab, setActiveTab] = useState<TabValue>(TabValue.PRODUCTS);
    const [searchQuery, setSearchQuery] = useState<string>("");

    const handleTabChange = useCallback(
        (event: React.SyntheticEvent, newValue: TabValue) => {
            setActiveTab(newValue);
            setSearchQuery("");
        },
        []
    );

    return {
        activeTab,
        searchQuery,
        setSearchQuery,
        handleTabChange,
    };
};
