import { MockAddress } from '@/entity/Addresses/Addresses.mock';
import axios from 'axios';

import { saveAddressAPI } from './saveAddress';

describe('saveAddressAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw any error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => ({
        data: MockAddress,
      }));

      const response = await saveAddressAPI(MockAddress);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/addresses', MockAddress);
      expect(response.data).toEqual(MockAddress);
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(saveAddressAPI(MockAddress)).rejects.toThrow(
        'Mock error message'
      );
    });
  });
});
