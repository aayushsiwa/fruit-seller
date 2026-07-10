import axios from 'axios';

import { removeFavoriteAPI } from './removeFavorite';

vi.unmock('@/lib/api/favorites/removeFavorite');

describe('removeFavoriteAPI()', () => {
  describe('When API call is successful', () => {
    it('should delete by product id', async () => {
      vi.spyOn(axios, 'delete').mockImplementation(async () => ({
        data: { message: 'Removed' },
      }));

      const response = await removeFavoriteAPI('prod1');

      expect(axios.delete).toHaveBeenCalledTimes(1);
      expect(axios.delete).toHaveBeenCalledWith('/api/favorites/prod1');
      expect(response.data).toEqual({ message: 'Removed' });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'delete').mockImplementation(async () => {
        throw new Error('Delete failed');
      });

      await expect(removeFavoriteAPI('prod1')).rejects.toThrow('Delete failed');
    });
  });
});
