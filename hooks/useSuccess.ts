import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Order, CartItem, ItemType } from "@/types";

export const useSuccess = () => {
    const router = useRouter();
    const { orderId } = router.query;
    const [order, setOrder] = useState<Order | null>(null);
    const [products, setProducts] = useState<(ItemType | undefined)[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (orderId && typeof orderId === "string") {
            const fetchOrder = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const { data } = await axios.get<Order>(
                        `/api/orders/${orderId}`
                    );
                    setOrder(data);

                    const productFetches = data.items.map((item: CartItem) =>
                        axios
                            .get<ItemType>(`/api/products/${item.id}`)
                            .then((res) => res.data)
                            .catch(() => undefined)
                    );
                    const fetchedProducts = await Promise.all(productFetches);
                    setProducts(fetchedProducts);
                } catch (err: unknown) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "An unknown error occurred"
                    );
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrder();
        }
    }, [orderId]);

    const handleContinueShopping = () => {
        router.push("/products");
    };

    return {
        order,
        products,
        isLoading,
        error,
        handleContinueShopping,
    };
};
