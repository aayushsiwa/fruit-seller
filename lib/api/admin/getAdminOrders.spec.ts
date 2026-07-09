import { Order } from '@/entity/Orders/Orders';
import { MockOrders } from '@/entity/Orders/Orders.mock';
import axios from 'axios';

import { getAdminOrdersAPI } from './getAdminOrders';

describe('getAdminOrdersAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Orders are present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          status: 200,
          data: MockOrders,
        });

        const response = await getAdminOrdersAPI();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual(MockOrders.map((o) => new Order(o)));
      });
    });

    describe('When Orders are not present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: [] });

        const response = await getAdminOrdersAPI();

        expect(response).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getAdminOrdersAPI()).rejects.toThrow('Failed to fetch');
    });
  });
});
