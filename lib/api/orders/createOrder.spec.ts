import { MockAddress } from '@/entity/Addresses/Addresses.mock';
import { Order } from '@/entity/Orders/Orders';
import { MockOrders } from '@/entity/Orders/Orders.mock';
import { MockCartItems } from '@/entity/Payments/Payments.mock';
import axios from 'axios';

import { CreateOrderPayload, createOrderAPI } from './createOrder';

const mockPayload: CreateOrderPayload = {
  cart: MockCartItems,
  total: 50,
  razorpayPaymentID: 'pay_123',
  razorpayOrderID: 'order_123',
  razorpaySignature: 'sig_123',
  shippingAddress: MockAddress,
};

describe('createOrderAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw any error and return Order instance', async () => {
      // MockOrders[0] is already an Order instance, but createOrderAPI
      // expects raw data to be passed into new Order(). Let's use the JSON
      // representation of MockOrders[0] as the mock response from axios.
      const rawOrderData = JSON.parse(JSON.stringify(MockOrders[0]));

      vi.spyOn(axios, 'post').mockImplementation(async () => ({
        data: { order: rawOrderData },
      }));

      const response = await createOrderAPI(mockPayload);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/orders', mockPayload);

      // Verify mapping to new Order(orderData)
      expect(response.data.order).toBeInstanceOf(Order);
      expect(response.data.order).toEqual(new Order(rawOrderData));
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(createOrderAPI(mockPayload)).rejects.toThrow(
        'Mock error message'
      );
    });
  });
});
