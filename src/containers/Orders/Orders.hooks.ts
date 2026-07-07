import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Order, UseOrdersPageReturn } from "@/types/index";

export const useOrdersPage = (): UseOrdersPageReturn => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const { data } = await axios.get<Order[]>("/api/orders");
                setOrders(data);
            } catch (err: unknown) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to load orders"
                );
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleViewOrder = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    const handleContinueShopping = () => {
        router.push("/products");
    };

    return {
        orders,
        isLoading,
        error,
        handleViewOrder,
        handleContinueShopping,
    };
};
