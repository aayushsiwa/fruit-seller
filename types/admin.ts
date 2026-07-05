import { ItemType, User, Order } from "@/types/index";
import { UseMutationResult } from "@tanstack/react-query";
import { TabValue } from "@/types/index";
import { FormikProps } from "formik";

export type ProductFormValues = Partial<ItemType>;
export type UserFormValues = Partial<User>;

export type UseAdminActionsReturn = {
    handleSaveProduct: (
        event: React.FormEvent<HTMLFormElement>
    ) => Promise<void>;
    handleDeleteProduct: () => Promise<void>;
    handleSaveUser: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
    handleDeleteUser: () => Promise<void>;
    handleUpdateOrderStatus: (status: string) => Promise<void>;
};

export interface AdminActionsProps {
    saveProductMutation: UseMutationResult<
        ItemType,
        Error,
        { productData: Partial<ItemType>; isEdit: boolean; id?: string },
        unknown
    >;
    deleteProductMutation: UseMutationResult<void, Error, string, unknown>;
    saveUserMutation: UseMutationResult<
        User,
        Error,
        { userData: Partial<User>; isEdit: boolean; id?: string },
        unknown
    >;
    deleteUserMutation: UseMutationResult<void, Error, string, unknown>;
    updateOrderMutation: UseMutationResult<
        Order,
        Error,
        { id: string; status: string },
        unknown
    >;
    selectedProduct: Partial<ItemType>;
    selectedUser: Partial<User>;
    selectedOrder: Partial<Order>;
    isEditProduct: boolean;
    isEditUser: boolean;
    handleCloseProductDialog: () => void;
    handleCloseDeleteDialog: () => void;
    handleCloseUserDialog: () => void;
    handleCloseUserDeleteDialog: () => void;
    handleCloseOrderDialog: () => void;
    setError: (error: string | null) => void;
}

export type UseAdminMutationsReturn = {
    saveProductMutation: UseMutationResult<
        unknown,
        Error,
        { productData: Partial<ItemType>; isEdit: boolean; id?: string }
    >;
    deleteProductMutation: UseMutationResult<unknown, Error, string>;
    saveUserMutation: UseMutationResult<
        unknown,
        Error,
        { userData: Partial<User>; isEdit: boolean; id?: string }
    >;
    deleteUserMutation: UseMutationResult<unknown, Error, string>;
    updateOrderMutation: UseMutationResult<
        unknown,
        Error,
        { id: string; status: string }
    >;
};

export type UseAdminDialogsReturn = {
    openProductDialog: boolean;
    openDeleteDialog: boolean;
    openUserDialog: boolean;
    openUserDeleteDialog: boolean;
    openOrderDialog: boolean;
    selectedProduct: Partial<ItemType>;
    selectedUser: Partial<User>;
    selectedOrder: Partial<Order>;
    error: string | null;
    setError: (err: string | null) => void;
    isEditProduct: boolean;
    isEditUser: boolean;
    setSelectedOrder: (order: Partial<Order>) => void;
    handleOpenProductDialog: (product?: Partial<ItemType> | null) => void;
    handleCloseProductDialog: () => void;
    handleOpenDeleteDialog: (product: ItemType) => void;
    handleCloseDeleteDialog: () => void;
    handleOpenUserDialog: (user?: Partial<User> | null) => void;
    handleCloseUserDialog: () => void;
    handleOpenUserDeleteDialog: (user: User) => void;
    handleCloseUserDeleteDialog: () => void;
    handleOpenOrderDialog: (order: Order) => void;
    handleCloseOrderDialog: () => void;
};

export interface UseAdminDataReturn {
  products: ItemType[] | undefined;
  users: User[] | undefined;
  orders: Order[] | undefined;
  isLoadingProducts: boolean;
  isLoadingUsers: boolean;
  isLoadingOrders: boolean;
  productsError: unknown;
  // productFormik: FormikProps<ProductFormValues>;
  // userFormik: FormikProps<UserFormValues>;
  usersError: unknown;
  ordersError: unknown;
}

export type UseAdminDashboardReturn = {
    activeTab: TabValue;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    handleTabChange: (event: React.SyntheticEvent, newValue: TabValue) => void;
};


