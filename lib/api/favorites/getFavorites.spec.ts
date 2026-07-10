import { MockProducts } from '@/entity/Products/Products.mock';
import axios from 'axios';

import { getFavoritesAPI } from './getFavorites';

vi.unmock('@/lib/api/favorites/getFavorites');

describe('getFavoritesAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Favorites are present', () => {
      it('should return products', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: MockProducts,
        }));

        const response = await getFavoritesAPI();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('/api/favorites');
        expect(response.data[0].name).toEqual('Grapes');
      });
    });

    describe('When Favorites are empty', () => {
      it('should return empty array', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: [],
        }));

        const response = await getFavoritesAPI();

        expect(response.data).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Fetch failed');
      });

      await expect(getFavoritesAPI()).rejects.toThrow('Fetch failed');
    });
  });
});
