import { MockCartItems } from '@/entity/Payments/Payments.mock';
import { MockPaymentResponse } from '@/entity/Payments/Payments.mock';
import axios from 'axios';

import { initPaymentAPI } from './initPayment';

const mockTotal = 100;

describe('initPaymentAPI()', () => {
  describe('When API call is successful', () => {
    it('should not throw any error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => ({
        data: MockPaymentResponse,
      }));

      const response = await initPaymentAPI(MockCartItems, mockTotal);

      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith('/api/payments/init', {
        cart: MockCartItems,
        total: mockTotal,
      });
      expect(response.data).toEqual(MockPaymentResponse);
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'post').mockImplementation(async () => {
        throw new Error('Mock error message');
      });

      await expect(initPaymentAPI(MockCartItems, mockTotal)).rejects.toThrow(
        'Mock error message'
      );
    });
  });
});
