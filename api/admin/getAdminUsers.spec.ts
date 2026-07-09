import { User } from '@/entity/Users/Users';
import { MockUsers } from '@/entity/Users/Users.mock';
import axios from 'axios';

import { getAdminUsersAPI } from './getAdminUsers';

describe('getAdminUsersAPI()', () => {
  describe('When API call is successful', () => {
    describe('When Users are present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({
          status: 200,
          data: MockUsers,
        });

        const response = await getAdminUsersAPI();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(response).toStrictEqual(MockUsers.map((u) => new User(u)));
      });
    });

    describe('When Users are not present', () => {
      it('should not throw any error', async () => {
        vi.spyOn(axios, 'get').mockResolvedValue({ status: 200, data: [] });

        const response = await getAdminUsersAPI();

        expect(response).toEqual([]);
      });
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'get').mockResolvedValue({
        status: 500,
        statusText: 'Internal Server Error',
      });

      await expect(getAdminUsersAPI()).rejects.toThrow('Failed to fetch');
    });
  });
});
