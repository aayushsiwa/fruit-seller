import { ItemType, Order, OrderStatus, User } from '@/types/index';
import { TabValue } from '@/types/index';
import { UseMutationResult } from '@tanstack/react-query';

export type ProductFormValues = Partial<ItemType>;
export type UserFormValues = Partial<User>;

export type UseAdminActionsReturn = {
  handleSaveProduct: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteProduct: () => Promise<void>;
  handleSaveUser: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteUser: () => Promise<void>;
  handleUpdateOrderStatus: (status: OrderStatus) => void;
  handleConfirmOrderStatus: () => Promise<void>;
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
    {
      id: string;
      status: OrderStatus;
      shipped_at?: string;
      delivered_at?: string;
      cancelled_at?: string;
    },
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
  handleOpenConfirmDialog: (status: OrderStatus) => void;
  handleCloseConfirmDialog: () => void;
  confirmStatus: OrderStatus;
}

export type UseAdminMutationsReturn = {
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
    {
      id: string;
      status: OrderStatus;
      shipped_at?: string;
      delivered_at?: string;
      cancelled_at?: string;
    },
    unknown
  >;
};

export type UseAdminDialogsReturn = {
  openProductDialog: boolean;
  openDeleteDialog: boolean;
  openUserDialog: boolean;
  openUserDeleteDialog: boolean;
  openOrderDialog: boolean;
  openConfirmDialog: boolean;
  confirmStatus: OrderStatus;
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
  handleOpenConfirmDialog: (status: OrderStatus) => void;
  handleCloseConfirmDialog: () => void;
};

export interface UseAdminDataReturn {
  products: ItemType[] | undefined;
  users: User[] | undefined;
  orders: Order[] | undefined;
  isLoadingProducts: boolean;
  isLoadingUsers: boolean;
  isLoadingOrders: boolean;
  productsError: unknown;
  usersError: unknown;
  ordersError: unknown;
}

export type UseAdminDashboardReturn = {
  activeTab: TabValue;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleTabChange: (event: React.SyntheticEvent, newValue: TabValue) => void;
};
