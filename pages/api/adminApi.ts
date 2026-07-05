import axios from "axios";
import { ItemType, User,Order } from "@/types/index";

export const saveProduct = async (
    productData: Partial<ItemType>,
    isEdit: boolean,
    id?: string
) => {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/products/${id}` : "/api/products";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
    });
    if (!response.ok) {
        throw new Error(
            isEdit ? "Failed to update product" : "Failed to create product"
        );
    }

    return response.json();
};

export const deleteProduct = async (id: string) => {
    const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete product");
    }

    return response.json();
};

export const saveUser = async (
    userData: Partial<User>,
    isEdit: boolean,
    id?: string
) => {
    const method = isEdit ? "PUT" : "POST";
    const url = isEdit ? `/api/admin/users/${id}` : "/api/admin/users";

    const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error(
            isEdit ? "Failed to update user" : "Failed to create user"
        );
    }

    return response.json();
};

export const deleteUser = async (id: string) => {
    const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete user");
    }

    return response.json();
};

export const updateOrderStatus = async (id: string, status: string) => {
    const response = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Failed to update order status");
    }

    return response.json();
};


export const fetchProducts = async (): Promise<ItemType[]> => {
  const response = await axios.get("/api/products");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }
  return response.data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axios.get("/api/admin/users");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  return response.data;
};

export const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get("/api/admin/orders");
  if (response.status !== 200) {
    throw new Error(`Failed to fetch orders: ${response.statusText}`);
  }
  return response.data;
};