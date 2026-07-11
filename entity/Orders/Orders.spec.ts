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
  ID: 'addr-1',
  street: '123 Mango Lane',
  city: 'Mumbai',
  state: 'Maharashtra',
  postalCode: '400001',
  country: 'India',
  phone: '9876543210',
};

const requiredOrderData: OrderType = {
  ID: 'order-1',
  userName: 'John Doe',
  items: mockItems,
  total: 360,
  createdAt: '2024-06-01T08:00:00.000Z',
  status: 'PROCESSING' as OrderStatus,
};

describe('Order entity', () => {
  describe('with required fields only', () => {
    it('creates an instance of Order', () => {
      const order = new Order(requiredOrderData);
      expect(order).toBeInstanceOf(Order);
    });

    it('maps all required fields correctly', () => {
      const order = new Order(requiredOrderData);

      expect(order.ID).toBe('order-1');
      expect(order.userName).toBe('John Doe');
      expect(order.items).toEqual(mockItems);
      expect(order.total).toBe(360);
      expect(order.createdAt).toBe('2024-06-01T08:00:00.000Z');
      expect(order.status).toBe('PROCESSING');
    });

    it('leaves optional fields undefined when omitted', () => {
      const order = new Order(requiredOrderData);

      expect(order.paymentID).toBeUndefined();
      expect(order.razorpayOrderID).toBeUndefined();
      expect(order.shippedAt).toBeUndefined();
      expect(order.deliveredAt).toBeUndefined();
      expect(order.cancelledAt).toBeUndefined();
      expect(order.shippingAddress).toBeUndefined();
    });
  });

  describe('with optional fields provided', () => {
    const fullOrderData: OrderType = {
      ...requiredOrderData,
      paymentID: 'pay_abc123',
      razorpayOrderID: 'order_xyz456',
      shippedAt: '2024-06-02T10:00:00.000Z',
      deliveredAt: '2024-06-05T15:30:00.000Z',
      cancelledAt: undefined,
      shippingAddress: mockAddress,
    };

    it('maps paymentID and razorpayOrderID', () => {
      const order = new Order(fullOrderData);
      expect(order.paymentID).toBe('pay_abc123');
      expect(order.razorpayOrderID).toBe('order_xyz456');
    });

    it('maps shippedAt and deliveredAt', () => {
      const order = new Order(fullOrderData);
      expect(order.shippedAt).toBe('2024-06-02T10:00:00.000Z');
      expect(order.deliveredAt).toBe('2024-06-05T15:30:00.000Z');
    });

    it('maps shippingAddress with all address fields', () => {
      const order = new Order(fullOrderData);
      expect(order.shippingAddress).toEqual(mockAddress);
      expect(order.shippingAddress?.city).toBe('Mumbai');
    });

    it('maps cancelledAt when set', () => {
      const cancelledOrder = new Order({
        ...requiredOrderData,
        status: 'CANCELLED',
        cancelledAt: '2024-06-03T09:00:00.000Z',
      });
      expect(cancelledOrder.cancelledAt).toBe('2024-06-03T09:00:00.000Z');
    });
  });
});
