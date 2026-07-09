import { MockProducts } from '@/entity/Products/Products.mock';
import {
  Address,
  OrderItem,
  OrderStatus,
  Order as OrderType,
} from '@/types/index';
import { describe, expect, it } from 'vitest';

import { Order } from './Orders';

const mockItems: OrderItem[] = [
  { quantity: 2, product: MockProducts[0] },
  { quantity: 1, product: MockProducts[1] },
];

const mockAddress: Address = {
  id: 'addr-1',
  street: '123 Mango Lane',
  city: 'Mumbai',
  state: 'Maharashtra',
  postal_code: '400001',
  country: 'India',
  phone: '9876543210',
};

const requiredOrderData: OrderType = {
  id: 'order-1',
  userName: 'John Doe',
  items: mockItems,
  total: 360,
  createdAt: '2024-06-01T08:00:00.000Z',
  status: 'Processing' as OrderStatus,
};

describe('Order entity', () => {
  describe('with required fields only', () => {
    it('creates an instance of Order', () => {
      const order = new Order(requiredOrderData);
      expect(order).toBeInstanceOf(Order);
    });

    it('maps all required fields correctly', () => {
      const order = new Order(requiredOrderData);

      expect(order.id).toBe('order-1');
      expect(order.userName).toBe('John Doe');
      expect(order.items).toEqual(mockItems);
      expect(order.total).toBe(360);
      expect(order.createdAt).toBe('2024-06-01T08:00:00.000Z');
      expect(order.status).toBe('Processing');
    });

    it('leaves optional fields undefined when omitted', () => {
      const order = new Order(requiredOrderData);

      expect(order.payment_id).toBeUndefined();
      expect(order.razorpay_order_id).toBeUndefined();
      expect(order.shipped_at).toBeUndefined();
      expect(order.delivered_at).toBeUndefined();
      expect(order.cancelled_at).toBeUndefined();
      expect(order.shipping_address).toBeUndefined();
    });
  });

  describe('with optional fields provided', () => {
    const fullOrderData: OrderType = {
      ...requiredOrderData,
      payment_id: 'pay_abc123',
      razorpay_order_id: 'order_xyz456',
      shipped_at: '2024-06-02T10:00:00.000Z',
      delivered_at: '2024-06-05T15:30:00.000Z',
      cancelled_at: undefined,
      shipping_address: mockAddress,
    };

    it('maps payment_id and razorpay_order_id', () => {
      const order = new Order(fullOrderData);
      expect(order.payment_id).toBe('pay_abc123');
      expect(order.razorpay_order_id).toBe('order_xyz456');
    });

    it('maps shipped_at and delivered_at', () => {
      const order = new Order(fullOrderData);
      expect(order.shipped_at).toBe('2024-06-02T10:00:00.000Z');
      expect(order.delivered_at).toBe('2024-06-05T15:30:00.000Z');
    });

    it('maps shipping_address with all address fields', () => {
      const order = new Order(fullOrderData);
      expect(order.shipping_address).toEqual(mockAddress);
      expect(order.shipping_address?.city).toBe('Mumbai');
    });

    it('maps cancelled_at when set', () => {
      const cancelledOrder = new Order({
        ...requiredOrderData,
        status: 'Cancelled',
        cancelled_at: '2024-06-03T09:00:00.000Z',
      });
      expect(cancelledOrder.cancelled_at).toBe('2024-06-03T09:00:00.000Z');
    });
  });
});
