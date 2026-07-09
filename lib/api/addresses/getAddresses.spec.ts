import { MockAddresses } from '@/entity/Addresses/Addresses.mock';
import axios from 'axios';

import { getAddressesAPI } from './getAddresses';

describe('getAddressesAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Addresses are present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: MockAddresses,
        }));

        const response = await getAddressesAPI();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('/api/addresses');
        expect(response.data).toEqual(MockAddresses);
      });
    });

    describe('When Addresses are not present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockImplementation(async () => ({
          data: [],
        }));

        const response = await getAddressesAPI();

        expect(response.data).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(getAddressesAPI()).rejects.toThrow('Mock error message');
    });
  });
});
