import { Order } from '@/entity/Orders/Orders';
import { MockOrders } from '@/entity/Orders/Orders.mock';
import axios from 'axios';

import { getOrdersAPI } from './getOrders';

describe('getOrdersAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Orders are present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: MockOrders,
        }));

        const response = await getOrdersAPI();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('/api/orders');
        expect(response.data).toEqual(MockOrders);
        expect(response.data).toStrictEqual(
          MockOrders.map((o) => new Order(o))
        );
      });
    });

    describe('When Orders are not present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: null,
        }));

        const response = await getOrdersAPI();

        expect(response.data).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(getOrdersAPI()).rejects.toThrow('Mock error message');
    });
  });
});
