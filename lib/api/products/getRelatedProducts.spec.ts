import { Product } from '@/entity/Products/Products';
import { MockProducts } from '@/entity/Products/Products.mock';
import axios from 'axios';

import { getRelatedProductsAPI } from './getRelatedProducts';

describe('getRelatedProductsAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Products are present as object', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: { products: MockProducts },
        }));

        const response = await getRelatedProductsAPI('1');

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('/api/products?related=1');
        expect(response.data.products).toEqual(MockProducts);
        expect(response.data.products).toStrictEqual(
          MockProducts.map((p) => new Product(p))
        );
      });
    });

    describe('When Products are present as array', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: MockProducts,
        }));

        const response = await getRelatedProductsAPI('1');

        expect(response.data.products).toEqual(MockProducts);
        expect(response.data.products).toStrictEqual(
          MockProducts.map((p) => new Product(p))
        );
      });
    });

    describe('When Products are not present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: [],
        }));

        const response = await getRelatedProductsAPI('1');

        expect(response.data.products).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(getRelatedProductsAPI('1')).rejects.toThrow(
        'Mock error message'
      );
    });
  });
});
