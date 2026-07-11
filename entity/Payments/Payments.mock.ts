import { CartItem } from '@/types/index';

export const MockCartItems: CartItem[] = [{ productID: '1', quantity: 2 }];
export const MockPaymentResponse = {
  razorpayOrderID: 'order_123',
  amount: 100,
  key_id: 'rzp_test_123',
};
