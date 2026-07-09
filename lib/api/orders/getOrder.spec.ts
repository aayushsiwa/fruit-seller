import { Order } from '@/entity/Orders/Orders';
import { MockOrders } from '@/entity/Orders/Orders.mock';
import axios from 'axios';

import { getOrderAPI } from './getOrder';

describe('getOrderAPI()', () => {
  const orderId = 'order-1';
  const mockOrder = MockOrders[0];

  describe('When API call is successful', () => {
    describe('When Order is present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: mockOrder,
        }));

        const response = await getOrderAPI(orderId);

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(`/api/orders/${orderId}`);
        expect(response.data).toEqual(mockOrder);
        expect(response.data).toStrictEqual(new Order(mockOrder));
      });
    });

    describe('When Order is not present', () => {
      it('should throw order not found error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: null,
        }));

        await expect(getOrderAPI(orderId)).rejects.toThrow('Order not found');
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(getOrderAPI(orderId)).rejects.toThrow('Mock error message');
    });
  });
});
