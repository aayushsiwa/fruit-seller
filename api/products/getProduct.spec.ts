import { Product } from '@/entity/Products/Products';
import { MockProducts } from '@/entity/Products/Products.mock';
import axios from 'axios';

import { getProductAPI } from './getProduct';

describe('getProductAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Product is present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: MockProducts[0],
        }));

        const response = await getProductAPI('1');

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('/api/products/1');
        expect(response.data.product).toEqual(MockProducts[0]);
        expect(response.data.product).toStrictEqual(
          new Product(MockProducts[0])
        );
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(getProductAPI('1')).rejects.toThrow('Mock error message');
    });
  });
});
