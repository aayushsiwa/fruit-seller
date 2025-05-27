import { UseMutationResult } from "@tanstack/react-query";
import { DefaultSession } from "next-auth";
import { useRouter } from "next/router";

export interface ItemType {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
    category: string;
    discount: number;
    isSeasonal: boolean;
    createdAt: string;
}

export interface CartItem {
    id: string;
    quantity: number;
}

export interface Order {
    id: string;
    userName: string;
    items: CartItem[];
    total: number;
    createdAt: string;
    status: string;
}

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
}

// Cart Context
export interface CartContextType {
    cart: CartItem[];
    loading: boolean;
    addToCart: (product: ItemType, quantity?: number) => void;
    updateQuantity: (
        productId: string,
        quantity: number,
        maxQuantity: number
    ) => void;
    removeFromCart: (productId: string) => void;
    clearCart: () => void;
    getCartTotal: (products: (ItemType | undefined)[]) => number;
    getCartItemCount: () => number;
    showSnackbar: (message: string, severity: "success" | "error") => void;
}

export interface LayoutProps {
    children: React.ReactNode;
}

export enum TabValue {
    PRODUCTS = 0,
    USERS = 1,
    ORDERS = 2,
}

export interface DashboardStatsProps {
    products: ItemType[];
    users: User[];
    orders: Order[];
    isLoadingProducts: boolean;
    isLoadingUsers: boolean;
    isLoadingOrders: boolean;
}

export interface OrdersTabProps {
    orders: Order[];
    isLoading: boolean;
    error: string | null;
    onEditOrder: (order: Order) => void;
}

export interface ProductsTabProps {
    products: ItemType[];
    isLoading: boolean;
    error: string | null;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddProduct: () => void;
    onEditProduct: (product: ItemType) => void;
    onDeleteProduct: (product: ItemType) => void;
}

export interface UsersTabProps {
    users: User[];
    isLoading: boolean;
    error: string | null;
    onAddUser: () => void;
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
}

export interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading: boolean;
    entity: Partial<ItemType | User>;
    entityType: "product" | "user";
}

export interface OrderDialogProps {
    open: boolean;
    order: Partial<Order>;
    onClose: () => void;
    onUpdateStatus: (status: string) => void;
    onOrderChange: (order: Partial<Order>) => void;
    isLoading: boolean;
}

export interface ProductDialogProps {
    open: boolean;
    product: Partial<ItemType>;
    onClose: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export interface UserDialogProps {
    open: boolean;
    user: Partial<User>;
    onClose: () => void;
    onSave: (event: React.FormEvent<HTMLFormElement>) => void;
    isLoading: boolean;
}

export interface CartItemsProps {
    cart: CartItem[];
    products: (ItemType | undefined)[];
    handleQuantityChange: (
        id: string,
        newQuantity: number,
        maxQuantity: number
    ) => void;
    handleRemoveItem: (id: string) => void;
    isLoadingProducts: boolean;
    hasError: boolean;
}

export interface EmptyCartProps {
    handleContinueShopping: () => void;
}

export interface OrderSummaryProps {
    cart: CartItem[];
    products: (ItemType | undefined)[];
    getCartTotal: (products: (ItemType | undefined)[]) => number;
    handlePayNow: () => void;
    processing: boolean;
    hasError: boolean;
    handleCheckout: () => void;
    disabled?: boolean;
}

export interface FeaturedSectionProps {
    featuredProducts: ItemType[];
    isLoading: boolean;
    error: string | null;
}

export interface HeroSectionProps {
    currentSlide: number;
}

export interface DesktopNavProps {
    user: SessionUser["user"] | undefined;
    router: ReturnType<typeof useRouter>;
    searchQuery: string;
    getCartItemCount: () => number;
    setSearchQuery: (value: string) => void;
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleProfileMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface DrawerContentProps {
    user: SessionUser["user"] | undefined;
    searchQuery: string;
    getCartItemCount: () => number;
    isAdmin: boolean;
    setSearchQuery: (value: string) => void;
    handleDrawerToggle: () => void;
    handleSearch: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleNavigation: (path: string) => void;
    handleLogout: () => void;
}

export interface MobileNavProps {
    user: SessionUser["user"] | undefined;
    router: ReturnType<typeof useRouter>;
    handleDrawerToggle: () => void;
}

export interface ProfileMenuProps {
    user: SessionUser["user"] | undefined;
    anchorEl: HTMLButtonElement | null;
    isAdmin: boolean;
    handleMenuClose: () => void;
    handleNavigation: (path: string) => void;
    handleLogout: () => void;
}

export interface BreadcrumbsNavProps {
    productName: string;
}

export interface ProductInfoProps {
    product: ItemType;
    isMobile: boolean;
    cartQuantity: number;
    error: string | null;
    setError: (error: string | null) => void;
    handleAddToCart: () => void;
    handleQuantityChange: (quantity: number) => void;
    handleShare: () => void;
}

export interface RelatedProductsProps {
    relatedProducts: ItemType[];
}

export interface FilterChipsProps {
    getFilterSummary: () => string[];
    setPriceRange: (range: [number, number]) => void;
    minPrice: number;
    maxPrice: number;
    setCategory: (category: string) => void;
    setSortOption: (option: string) => void;
    setInStockOnly: (value: boolean) => void;
}

export interface FilterOptionsProps {
    priceRange: [number, number];
    setPriceRange: (range: [number, number]) => void;
    minPrice: number;
    maxPrice: number;
    category: string;
    setCategory: (category: string) => void;
    sortOption: string;
    setSortOption: (option: string) => void;
    inStockOnly: boolean;
    setInStockOnly: (value: boolean) => void;
    handleResetFilters: () => void;
    getFilterSummary: () => string[];
    categories: string[];
    sortOptions: { value: string; label: string }[];
}

export interface ProductGridProps {
    filteredProducts: ItemType[];
    isLoading: boolean;
    error: string | null;
    handleResetFilters: () => void;
}

export interface ErrorMessageProps {
    message: string;
    onRetry: () => void;
}

export interface OrderDetailsProps {
    order: Order;
    products: (ItemType | undefined)[];
}

export interface SessionUser {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string;
        cart_id?: string;
    };
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string;
        cart_id?: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            role: string;
            cart_id?: string;
        };
    }
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export type SnackbarSeverity = "success" | "error" | "warning" | "info";
export interface SnackbarContextType {
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

export interface LocalCartItem {
    id: string;
    quantity: number;
}

export interface AuthUser {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
    role?: string;
    cartId?: string;
}

export interface AuthContextType {
    user: AuthUser | null | undefined;
    loading: boolean;
    error: string | null;
    register: (userData: RegisterData) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isAdmin: () => boolean;
}

export interface ThemeSwitchContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

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