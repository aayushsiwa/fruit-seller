import { Product } from '@/entity/Products/Products';
import { MockProducts } from '@/entity/Products/Products.mock';
import axios from 'axios';

import { getAdminProductsAPI } from './getAdminProducts';

describe('getAdminProductsAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Products are present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          status: 200,
          data: { products: MockProducts },
        });

        const response = await getAdminProductsAPI();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual(MockProducts.map((p) => new Product(p)));
      });
    });

    describe('When Products are not present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: { products: [] } });

        const response = await getAdminProductsAPI();

        expect(response).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
        vi.spyOn(axios, 'get').mockRejectedValue(new Error('Failed to fetch'));

        await expect(getAdminProductsAPI()).rejects.toThrow('Failed to fetch');
    });
  });
});
