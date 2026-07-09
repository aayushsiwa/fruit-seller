import { PincodeOffice } from '@/entity/Pincodes/Pincodes';
import { useGetAddresses } from '@/lib/api/addresses/getAddresses';
import { useSaveAddress } from '@/lib/api/addresses/saveAddress';
import { useCreateOrder } from '@/lib/api/orders/createOrder';
import { useInitPayment } from '@/lib/api/payments/initPayment';
import { useGetPincode } from '@/lib/api/pincodes/getPincode';
import { getProductAPI } from '@/lib/api/products/getProduct';
import { useCart } from '@/src/contexts/CartContext';
import { Address, CartItem, IProduct } from '@/types/index';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

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

  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveToProfile, setSaveToProfile] = useState<boolean>(true);
  const [newAddress, setNewAddress] = useState<Address>({
    street: '',
    street2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
    phone: '',
  });
  const [isAddressAutoFilled, setIsAddressAutoFilled] = useState(false);

  const [offices, setOffices] = useState<PincodeOffice[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<PincodeOffice | null>(
    null
  );

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayLoaded);
  }, []);

  const { data: addressesResponse } = useGetAddresses(
    status === 'authenticated'
  );
  const savedAddresses = useMemo(
    () => addressesResponse?.data || [],
    [addressesResponse]
  );

  useEffect(() => {
    if (savedAddresses.length > 0 && selectedAddressId === 'new') {
      setSelectedAddressId(savedAddresses[0].id || 'new');
    }
  }, [savedAddresses, selectedAddressId]);

  const pin = newAddress.postal_code.trim();
  const isPinValid = pin.length === 6 && /^\d+$/.test(pin);

  const { data: pincodeResponse } = useGetPincode(pin, isPinValid);
  const pincodeData = pincodeResponse?.data;

  useEffect(() => {
    if (!isPinValid) {
      setOffices([]);
      setSelectedOffice(null);
      setIsAddressAutoFilled(false);
      return;
    }
  }, [isPinValid]);

  useEffect(() => {
    if (!pincodeData) return;

    const result = pincodeData.offices;
    setOffices(result);

    if (result.length === 1) {
      const office = result[0];
      setSelectedOffice(office);
      setNewAddress((prev) => ({
        ...prev,
        city: office.district,
        state: office.state,
      }));
      setIsAddressAutoFilled(true);
      showSnackbar('City and State auto-filled from Pincode!', 'success');
    } else if (result.length === 0) {
      setSelectedOffice(null);
      setIsAddressAutoFilled(false);
    } else {
      setSelectedOffice(null);
      setIsAddressAutoFilled(false);
    }
  }, [pincodeData, showSnackbar]);

  const handleSelectOffice = useCallback((office: PincodeOffice | null) => {
    setSelectedOffice(office);
    if (office) {
      setNewAddress((prev) => ({
        ...prev,
        city: office.district,
        state: office.state,
      }));
    }
  }, []);

  const productQueries = useQueries({
    queries: cart.map((item) => ({
      queryKey: ['product', item.id],
      queryFn: async () => {
        const response = await getProductAPI(item.id);
        return response.data.product;
      },
      enabled: !cartLoading,
    })),
  });

  const products = productQueries.map((query) => query.data as IProduct);
  const isLoadingProducts = productQueries.some((query) => query.isLoading);
  const hasError = productQueries.some((query) => query.error);

  const subtotal = getCartTotal(products);
  const shippingCost = subtotal >= 500 || subtotal === 0 ? 0 : 50;

  const saveAddressMutation = useSaveAddress();
  const initPaymentMutation = useInitPayment();
  const createOrderMutation = useCreateOrder();

  const handlePayNow = async () => {
    if (!session || status !== 'authenticated') {
      showSnackbar('Please sign in to proceed.', 'error');
      return;
    }

    if (!razorpayLoaded) {
      showSnackbar('Payment gateway loading. Please try again.', 'error');
      return;
    }

    let shippingAddress: Address;
    if (selectedAddressId === 'new') {
      const { street, city, state, postal_code, country, phone } = newAddress;
      if (!street || !city || !state || !postal_code || !country || !phone) {
        showSnackbar('Please fill in all shipping address fields.', 'error');
        return;
      }
      shippingAddress = newAddress;
    } else {
      const selected = savedAddresses.find(
        (addr) => addr.id === selectedAddressId
      );
      if (!selected) {
        showSnackbar('Selected address not found.', 'error');
        return;
      }
      shippingAddress = selected;
    }

    for (let i = 0; i < cart.length; i++) {
      const item = cart[i];
      const product = products[i];
      if (!product) {
        showSnackbar(`Product ${item.id} not found or invalid.`, 'error');
        return;
      }
      if (product.stock < item.quantity) {
        showSnackbar(`Insufficient stock for ${product.name}.`, 'error');
        return;
      }
    }

    setProcessing(true);
    try {
      const tax = subtotal * 0.1;
      const total = subtotal + tax + shippingCost;

      let finalAddress = { ...shippingAddress };
      if (selectedAddressId === 'new' && saveToProfile) {
        try {
          const addrRes = await saveAddressMutation.mutateAsync(newAddress);
          finalAddress = addrRes.data;
          setSelectedAddressId(finalAddress.id || 'new');
        } catch (addrErr) {
          console.error('Failed to save address to profile', addrErr);
        }
      }

      const initResponse = await initPaymentMutation.mutateAsync({
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
            const orderResponse = await createOrderMutation.mutateAsync({
              cart,
              total,
              ...response,
              shipping_address: finalAddress,
            });

            const order = orderResponse.data.order;
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
    savedAddresses,
    selectedAddressId,
    setSelectedAddressId,
    newAddress,
    setNewAddress,
    saveToProfile,
    setSaveToProfile,
    shippingCost,
    isAddressAutoFilled,
    offices,
    selectedOffice,
    handleSelectOffice,
  };
};

export type UseCheckoutReturn = {
  cart: CartItem[];
  products: IProduct[];
  isLoading: boolean;
  isLoadingProducts: boolean;
  hasError: boolean;
  processing: boolean;
  handlePayNow: () => Promise<void>;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  getCartTotal: (products: (IProduct | undefined)[]) => number;
  savedAddresses: Address[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  saveToProfile: boolean;
  setSaveToProfile: (save: boolean) => void;
  shippingCost: number;
  isAddressAutoFilled: boolean;
  offices: PincodeOffice[];
  selectedOffice: PincodeOffice | null;
  handleSelectOffice: (office: PincodeOffice | null) => void;
};
