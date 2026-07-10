import { Order } from '@/entity/Orders/Orders';
import { MockOrders } from '@/entity/Orders/Orders.mock';
import axios from 'axios';

import { getAdminOrderAPI } from './getAdminOrder';

describe('getAdminOrderAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw and return an Order instance', async () => {
      const rawOrder = JSON.parse(JSON.stringify(MockOrders[0]));

      vi.spyOn(axios, 'get').mockResolvedValue({
        status: 200,
        data: rawOrder,
      });

      const response = await getAdminOrderAPI('order-1');

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/admin/orders/order-1');
      expect(response).toStrictEqual(new Order(rawOrder));
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getAdminOrderAPI('order-1')).rejects.toThrow(
        'Failed to fetch'
      );
    });
  });
});
