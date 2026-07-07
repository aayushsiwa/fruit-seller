import { useRouter } from "next/router";
import { useOrderWithProducts } from "@/lib/hooks/useOrderWithProducts";

export const useSuccess = () => {
  const router = useRouter();
  const { order, products, isLoading, error } = useOrderWithProducts();

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
