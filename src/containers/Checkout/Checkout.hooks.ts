import { useCart } from '@/src/contexts/CartContext';
import { ItemType, UseCheckoutReturn } from '@/types/index';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

const fetchProductDetails = async (id: string) => {
  try {
    const response = await axios.get(`/api/products/${id}`);
    if (response.status !== 200 || !response.data) {
      throw new Error(`Failed to fetch product ${id}`);
    }
    return response.data;
  } catch (error) {
    throw new Error(
      `Failed to fetch product ${id} : ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
};

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const useCheckout = (): UseCheckoutReturn => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    cart,
    getCartTotal,
    clearCart,
    showSnackbar,
    loading: cartLoading,
  } = useCart();
  const [processing, setProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayLoaded);
  }, []);

  const productQueries = useQueries({
    queries: cart.map((item) => ({
      queryKey: ['product', item.id],
      queryFn: () => fetchProductDetails(item.id),
      enabled: !cartLoading,
    })),
  });

  const products = productQueries.map((query) => query.data as ItemType);
  const isLoadingProducts = productQueries.some((query) => query.isLoading);
  const hasError = productQueries.some((query) => query.error);

  const handlePayNow = async () => {
    if (!session || status !== 'authenticated') {
      showSnackbar('Please sign in to proceed.', 'error');
      return;
    }

    if (!razorpayLoaded) {
      showSnackbar('Payment gateway loading. Please try again.', 'error');
      return;
    }

    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const product = products[i];
      if (!product) {
        showSnackbar(`Product ${item.id} not found or invalid.`, 'error');
        return;
      }
      if (product.quantity < item.quantity) {
        showSnackbar(`Insufficient stock for ${product.name}.`, 'error');
        return;
      }
    }

    setProcessing(true);
    try {
      const total = getCartTotal(products) + getCartTotal(products) * 0.1;

      const initResponse = await axios.post('/api/payments/init', {
        cart,
        total,
      });
      const { razorpay_order_id, amount, key_id } = initResponse.data;

      const options = {
        key: key_id,
        amount,
        currency: 'INR',
        name: 'Fruit Seller',
        description: 'Fresh Fruits Delivered',
        order_id: razorpay_order_id,
        prefill: {
          email: session.user?.email || '',
        },
        theme: { color: '#ff6b6b' },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const orderResponse = await axios.post('/api/orders', {
              cart,
              total,
              ...response,
            });

            if (orderResponse.status !== 200 || !orderResponse.data) {
              showSnackbar('Failed to process order.', 'error');
              setProcessing(false);
              return;
            }

            const { order } = orderResponse.data;
            clearCart();
            showSnackbar('Order placed successfully!', 'success');
            router.push(`/success?orderId=${order.id}`);
          } catch (err) {
            const msg = axios.isAxiosError(err)
              ? err.response?.data?.details ||
                err.response?.data?.error ||
                err.message
              : 'Payment succeeded but order creation failed.';
            showSnackbar(msg, 'error');
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showSnackbar(error.message, 'error');
      } else {
        showSnackbar('Failed to initiate payment.', 'error');
      }
      setProcessing(false);
    }
  };

  return {
    cart,
    products,
    isLoading: status === 'loading' || cartLoading,
    isLoadingProducts,
    hasError,
    processing,
    handlePayNow,
    status,
    getCartTotal,
  };
};
