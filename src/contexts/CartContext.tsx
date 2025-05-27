import { createContext, useState, useContext, useEffect } from "react";
import { CartContextType, LayoutProps, ItemType, LocalCartItem } from "@/types";
import { useSnackbar } from "@/src/contexts/SnackBarContext";
import axios from "axios";

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: LayoutProps) {
  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error);
        showSnackbar("Error loading cart.", "error");
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cleanCart = async () => {
      const validCart: LocalCartItem[] = [];
      let hasInvalidItems = false;
      for (const item of cart) {
        try {
          const response = await axios.get(`/api/products/${item.id}`);
          if (response.status === 200) {
            const product: ItemType = response.data;
            if (item.quantity > product.quantity) {
              if (product.quantity === 0) {
                hasInvalidItems = true;
                continue;
              }
              validCart.push({
                ...item,
                quantity: product.quantity,
              });
              hasInvalidItems = true;
            } else {
              validCart.push(item);
            }
          } else {
            hasInvalidItems = true;
          }
        } catch {
          console.log(
            `Product ${item.id} not found, removing from cart.`
          );
          hasInvalidItems = true;
        }
      }
      if (hasInvalidItems) {
        setCart(validCart);
        showSnackbar(
          "Adjusted cart: removed or updated unavailable items.",
          "warning"
        );
      }
    };
    if (!loading && cart.length > 0) {
      cleanCart();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart, loading]);

  const addToCart = (product: ItemType, quantity: number = 1) => {
    if (quantity < 1 || product.quantity < quantity) {
      showSnackbar("Invalid quantity or insufficient stock.", "error");
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.quantity) {
          showSnackbar(
            "Cannot add: exceeds available stock.",
            "error"
          );
          return prevCart;
        }
        showSnackbar(`${product.name} updated in cart.`, "success");
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        showSnackbar(`${product.name} added to cart.`, "success");
        return [...prevCart, { id: product.id, quantity }];
      }
    });
  };

  const updateQuantity = (
    id: string,
    quantity: number,
    maxQuantity?: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    if (maxQuantity !== undefined && quantity > maxQuantity) {
      showSnackbar("Cannot update: exceeds available stock.", "error");
      return;
    }

    setCart((prevCart) => {
      showSnackbar("Cart updated.", "success");
      return prevCart.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      showSnackbar("Item removed from cart.", "success");
      return prevCart.filter((item) => item.id !== id);
    });
  };

  const clearCart = () => {
    setCart([]);
    showSnackbar("Cart cleared.", "success");
  };

  const getCartTotal = (products: (ItemType | undefined)[]) => {
    return cart.reduce((total, item, index) => {
      const product = products[index];
      if (!product) return total;
      const itemPrice = product.discount
        ? product.price * (1 - product.discount / 100)
        : product.price;
      return total + itemPrice * item.quantity;
    }, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartItemCount,
    showSnackbar,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
