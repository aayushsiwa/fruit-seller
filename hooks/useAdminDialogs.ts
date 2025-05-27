import { useState } from "react";
import { ItemType, User, Order } from "@/types";

export const useAdminDialogs = () => {
    const [openProductDialog, setOpenProductDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [openUserDialog, setOpenUserDialog] = useState(false);
    const [openUserDeleteDialog, setOpenUserDeleteDialog] = useState(false);
    const [openOrderDialog, setOpenOrderDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Partial<ItemType>>({});
    const [selectedUser, setSelectedUser] = useState<Partial<User>>({});
    const [selectedOrder, setSelectedOrder] = useState<Partial<Order>>({});
    const [error, setError] = useState<string | null>(null);
    const [isEditProduct, setIsEditProduct] = useState(false);
    const [isEditUser, setIsEditUser] = useState(false);

    const handleOpenProductDialog = (product: Partial<ItemType> | null = null) => {
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

    return {
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
    };
};