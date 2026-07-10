import { User } from '@/entity/Users/Users';
import { MockUsers } from '@/entity/Users/Users.mock';
import axios from 'axios';

import { getProfileAPI } from './getProfile';

describe('getProfileAPI()', () => {
  describe('When API call is successful', () => {
    it('should return the user wrapped in a Product-like response', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({ data: MockUsers[0] });

      const response = await getProfileAPI();

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('/api/users/profile');
      expect(response.data).toEqual(MockUsers[0]);
      expect(response.data).toStrictEqual(new User(MockUsers[0]));
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockRejectedValue(new Error('Mock error'));

      await expect(getProfileAPI()).rejects.toThrow('Mock error');
    });
  });
});
