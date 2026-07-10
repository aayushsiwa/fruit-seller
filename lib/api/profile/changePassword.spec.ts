import axios from 'axios';

import { changePasswordAPI } from './changePassword';

describe('changePasswordAPI()', () => {
  it('should PUT and return success', async () => {
    vi.spyOn(axios, 'put').mockResolvedValue({ data: { success: true } });

    const result = await changePasswordAPI({
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
    });

    expect(axios.put).toHaveBeenCalledWith('/api/users/change-password', {
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
    });
    expect(result).toEqual({ success: true });
  });

  it('should throw error on failure', async () => {
    vi.spyOn(axios, 'put').mockRejectedValue(new Error('Network error'));

    await expect(
      changePasswordAPI({
        currentPassword: 'OldPass1!',
        newPassword: 'NewPass1!',
      })
    ).rejects.toThrow('Network error');
  });
});
