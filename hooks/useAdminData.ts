import { useQuery } from "@tanstack/react-query";
import { ItemType, User, Order } from "@/types";
import axios from "axios";

const fetchProducts = async (): Promise<ItemType[]> => {
  const response = await axios.get("/api/products");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.data;
};

const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get("/api/admin/users");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  return response.data;
};

const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get("/api/admin/orders");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  return response.data;
};

export const useAdminData = (isAdmin: boolean) => {
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
