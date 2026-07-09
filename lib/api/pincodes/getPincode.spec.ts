import { MockPincodeData } from '@/entity/Pincodes/Pincodes.mock';
import axios from 'axios';

import { getPincodeAPI } from './getPincode';

describe('getPincodeAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw any error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => ({
        data: MockPincodeData,
      }));

      const response = await getPincodeAPI('400001');

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/pincodes/400001');
      expect(response.data).toEqual(MockPincodeData);
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(getPincodeAPI('400001')).rejects.toThrow(
        'Mock error message'
      );
    });
  });
});
