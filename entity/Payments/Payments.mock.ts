import { CartItem } from '@/types/index';

export const MockCartItems: CartItem[] = [{ id: '1', quantity: 2 }];
export const MockPaymentResponse = {
  razorpay_order_id: 'order_123',
  amount: 100,
  key_id: 'rzp_test_123',
};
