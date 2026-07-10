import axios from 'axios';

import { resetPasswordAPI } from './resetPassword';

describe('resetPasswordAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw any error and return success response', async () => {
      const mockResponse = {
        success: true,
        message: 'Password reset successful.',
      };
      vi.spyOn(axios, 'post').mockImplementation(async () => ({
        data: mockResponse,
      }));

      const response = await resetPasswordAPI({
        token: 'valid-token',
        password: 'new-password',
      });

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/auth/reset-password', {
        token: 'valid-token',
        password: 'new-password',
      });
      expect(response.data).toEqual(mockResponse);
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(
        resetPasswordAPI({ token: 'valid-token', password: 'new-password' })
      ).rejects.toThrow('Mock error message');
    });
  });
});
