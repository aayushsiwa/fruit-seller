import axios from 'axios';

import { forgotPasswordAPI } from './forgotPassword';

describe('forgotPasswordAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw any error and return success response', async () => {
      const mockResponse = {
        success: true,
        emailSent: true,
        message: 'Reset link sent.',
      };
      vi.spyOn(axios, 'post').mockImplementation(async () => ({
        data: mockResponse,
      }));

      const response = await forgotPasswordAPI({ email: 'test@example.com' });

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/auth/forgot-password', {
        email: 'test@example.com',
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
        forgotPasswordAPI({ email: 'test@example.com' })
      ).rejects.toThrow('Mock error message');
    });
  });
});
