import { useRouter } from "next/router";
import { useCart } from "@/src/contexts/CartContext";
import { ItemType } from "@/types";
import { MouseEvent } from "react";

const useProductCard = (product: ItemType) => {
    const router = useRouter();
    const { cart, addToCart, updateQuantity, removeFromCart } = useCart();

    const cartItem = cart.find((item) => item.id === product.id);
    const cartQuantity = cartItem ? cartItem.quantity : 0;

    const discountedPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : null;

    const isOutOfStock = product.quantity === 0;

    const handleAddToCart = (e: MouseEvent) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    const handleQuantityChange = (e: MouseEvent, newQuantity: number) => {
        e.stopPropagation();
        if (newQuantity <= 0) {
            removeFromCart(product.id);
        } else if (newQuantity <= product.quantity) {
            updateQuantity(product.id, newQuantity, product.quantity);
        }
    };

    const handleViewDetails = () => {
        router.push(`/products/${product.id}`);
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        e.stopPropagation();
        const value = Number.parseInt(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= product.quantity) {
            if (value === 0) {
                removeFromCart(product.id);
            } else {
                updateQuantity(product.id, value, product.quantity);
            }
        }
    };

    return {
        cartQuantity,
        discountedPrice,
        isOutOfStock,
        handleAddToCart,
        handleQuantityChange,
        handleViewDetails,
        handleInputChange,
    };
};

export default useProductCard;
