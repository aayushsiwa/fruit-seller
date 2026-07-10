import axios from 'axios';

import { addFavoriteAPI } from './addFavorite';

vi.unmock('@/lib/api/favorites/addFavorite');

describe('addFavoriteAPI()', () => {
  describe('When API call is successful', () => {
    it('should post product id', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => ({
        data: { id: 'fav1', product_id: 'prod1' },
      }));

      const response = await addFavoriteAPI('prod1');

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/favorites', {
        product_id: 'prod1',
      });
      expect(response.data).toEqual({ id: 'fav1', product_id: 'prod1' });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => {
        throw new Error('Post failed');
      });

      await expect(addFavoriteAPI('prod1')).rejects.toThrow('Post failed');
    });
  });
});
