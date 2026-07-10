import { clearCartAPI } from '@/lib/api/cart/clearCart';
import { getCartAPI } from '@/lib/api/cart/getCart';
import { removeCartItemAPI } from '@/lib/api/cart/removeCartItem';
import { saveCartItemAPI } from '@/lib/api/cart/saveCartItem';
import { updateCartItemAPI } from '@/lib/api/cart/updateCartItem';
import { useAuth } from '@/src/contexts/AuthContext';
import { useSnackbar } from '@/src/contexts/SnackBarContext';
import { CartItem, IProduct, LayoutProps } from '@/types/index';
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: LayoutProps) {
  const [cart, setCart] = useState<LocalCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showSnackbar } = useSnackbar();
  const { user } = useAuth();
  const userId = user?.id;

  // Sync a mutation to the server without blocking the UI. No-op when the
  // user is not authenticated (cart stays localStorage-only in that case).
  const syncCart = (fn: () => Promise<unknown>) => {
    if (!user) return;
    fn().catch((err) => console.error('Cart sync failed:', err));
  };

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        showSnackbar('Error loading cart.', 'error');
      }
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart, loading]);

  // On login, reconcile the cart both ways: push the logged-out localStorage
  // cart up to the server (POST for items not yet on the server, PUT to set the
  // quantity for items already there), then merge any server-only items into
  // the local view. For the same product on both sides, keep the higher
  // quantity. A product that doesn't exist on the server (e.g. 404) is skipped
  // and dropped from the local cart so it doesn't block the others.
  useEffect(() => {
    if (!userId || loading) return;
    getCartAPI()
      .then((serverItems) => {
        const serverItemMap = new Map(
          serverItems.map((item) => [item.id, item])
        );

        cart.forEach((item) => {
          const serverItem = serverItemMap.get(item.id);
          const quantity = serverItem
            ? Math.max(item.quantity, serverItem.quantity)
            : item.quantity;
          const push = serverItem
            ? updateCartItemAPI({ product_id: item.id, quantity })
            : saveCartItemAPI({ product_id: item.id, quantity });
          push.catch((err) => {
            // Only drop the item if it isn't on the server (e.g. no longer
            // exists). Items already on the server keep their server copy.
            if (!serverItem) {
              console.error(`Skipping cart item ${item.id}, not found:`, err);
              setCart((prev) => prev.filter((c) => c.id !== item.id));
            } else {
              console.error(`Could not sync cart item ${item.id}:`, err);
            }
          });
        });

        setCart((prev) => {
          const merged = new Map<string, CartItem>();
          prev.forEach((item) => merged.set(item.id, { ...item }));
          serverItems.forEach((serverItem) => {
            const localItem = merged.get(serverItem.id);
            if (localItem) {
              if (serverItem.quantity > localItem.quantity) {
                merged.set(serverItem.id, {
                  id: serverItem.id,
                  quantity: serverItem.quantity,
                });
              }
            } else {
              merged.set(serverItem.id, serverItem);
            }
          });
          return Array.from(merged.values());
        });
      })
      .catch((err) => console.error('Failed to load server cart:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, loading]);

  const addToCart = (product: IProduct, quantity: number = 1) => {
    if (quantity < 1 || product.stock < quantity) {
      showSnackbar('Invalid quantity or insufficient stock.', 'error');
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) {
        showSnackbar('Cannot add: exceeds available stock.', 'error');
        return;
      }
      showSnackbar(`${product.name} updated in cart.`, 'success');
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      );
      syncCart(() => saveCartItemAPI({ product_id: product.id, quantity }));
    } else {
      showSnackbar(`${product.name} added to cart.`, 'success');
      setCart((prevCart) => [...prevCart, { id: product.id, quantity }]);
      syncCart(() => saveCartItemAPI({ product_id: product.id, quantity }));
    }
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
      showSnackbar('Cannot update: exceeds available stock.', 'error');
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
    showSnackbar('Cart updated.', 'success');
    syncCart(() => updateCartItemAPI({ product_id: id, quantity }));
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    showSnackbar('Item removed from cart.', 'success');
    syncCart(() => removeCartItemAPI(id));
  };

  const clearCart = () => {
    setCart([]);
    showSnackbar('Cart cleared.', 'success');
    syncCart(() => clearCartAPI());
  };

  const getCartTotal = (products: (IProduct | undefined)[]) => {
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

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: IProduct, quantity?: number) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    maxQuantity: number
  ) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: (products: (IProduct | undefined)[]) => number;
  getCartItemCount: () => number;
  showSnackbar: (message: string, severity: 'success' | 'error') => void;
}

export interface LocalCartItem {
  id: string;
  quantity: number;
}
