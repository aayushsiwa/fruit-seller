import { User } from '@/entity/Users/Users';
import { MockUsers } from '@/entity/Users/Users.mock';
import axios from 'axios';

import { updateProfileAPI } from './updateProfile';

describe('updateProfileAPI()', () => {
  it('should PUT and return the updated user', async () => {
    vi.spyOn(axios, 'put').mockResolvedValue({ data: MockUsers[0] });

    const result = await updateProfileAPI({
      firstName: 'Alice',
      lastName: 'Smith',
    });

    expect(axios.put).toHaveBeenCalledWith('/api/users/profile', {
      firstName: 'Alice',
      lastName: 'Smith',
    });
    expect(result).toEqual(MockUsers[0]);
    expect(result).toStrictEqual(new User(MockUsers[0]));
  });

  it('should throw error on failure', async () => {
    vi.spyOn(axios, 'put').mockRejectedValue(new Error('Network error'));

    await expect(
      updateProfileAPI({ firstName: 'Alice', lastName: 'Smith' })
    ).rejects.toThrow('Network error');
  });
});
