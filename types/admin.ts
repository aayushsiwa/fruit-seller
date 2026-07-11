import { IProduct, Order, OrderStatus, User } from '@/types/index';
import { TabValue } from '@/types/index';
import { UseMutationResult } from '@tanstack/react-query';

export type ProductFormValues = Partial<IProduct>;
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
    IProduct,
    Error,
    { productData: Partial<IProduct>; isEdit: boolean; id?: string },
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
      shippedAt?: string;
      deliveredAt?: string;
      cancelledAt?: string;
    },
    unknown
  >;
  selectedProduct: Partial<IProduct>;
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
    IProduct,
    Error,
    { productData: Partial<IProduct>; isEdit: boolean; id?: string },
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
      shippedAt?: string;
      deliveredAt?: string;
      cancelledAt?: string;
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
  openOrderDetailsDialog: boolean;
  confirmStatus: OrderStatus;
  selectedProduct: Partial<IProduct>;
  selectedUser: Partial<User>;
  selectedOrder: Partial<Order>;
  selectedOrderId: string | undefined;
  error: string | null;
  setError: (err: string | null) => void;
  isEditProduct: boolean;
  isEditUser: boolean;
  setSelectedOrder: (order: Partial<Order>) => void;
  handleOpenProductDialog: (product?: Partial<IProduct> | null) => void;
  handleCloseProductDialog: () => void;
  handleOpenDeleteDialog: (product: IProduct) => void;
  handleCloseDeleteDialog: () => void;
  handleOpenUserDialog: (user?: Partial<User> | null) => void;
  handleCloseUserDialog: () => void;
  handleOpenUserDeleteDialog: (user: User) => void;
  handleCloseUserDeleteDialog: () => void;
  handleOpenOrderDialog: (order: Order) => void;
  handleCloseOrderDialog: () => void;
  handleOpenOrderDetailsDialog: (order: Order) => void;
  handleCloseOrderDetailsDialog: () => void;
  handleOpenConfirmDialog: (status: OrderStatus) => void;
  handleCloseConfirmDialog: () => void;
};

export interface UseAdminDataReturn {
  products: IProduct[] | undefined;
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
