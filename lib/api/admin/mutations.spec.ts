import { MockOrders } from '@/entity/Orders/Orders.mock';
import { MockProducts } from '@/entity/Products/Products.mock';
import { MockUsers } from '@/entity/Users/Users.mock';
import axios from 'axios';

import {
  deleteProductAPI,
  deleteUserAPI,
  saveProductAPI,
  saveUserAPI,
  updateOrderStatusAPI,
} from './mutations';

describe('saveProductAPI()', () => {
  describe('When creating a new product', () => {
    it('should POST and return the created product', async () => {
      vi.spyOn(axios, 'post').mockResolvedValue({ data: MockProducts[0] });

      const result = await saveProductAPI({
        productData: MockProducts[0],
        isEdit: false,
      });

      expect(axios.post).toHaveBeenCalledWith('/api/products', MockProducts[0]);
      expect(result).toEqual(MockProducts[0]);
    });
  });

  describe('When editing an existing product', () => {
    it('should PUT to the product endpoint and return the updated product', async () => {
      vi.spyOn(axios, 'put').mockResolvedValue({ data: MockProducts[0] });

      const result = await saveProductAPI({
        productData: MockProducts[0],
        isEdit: true,
        id: 'prod-1',
      });

      expect(axios.put).toHaveBeenCalledWith(
        '/api/products/prod-1',
        MockProducts[0]
      );
      expect(result).toEqual(MockProducts[0]);
    });
  });

  describe('When API call fails', () => {
    it('should throw error', async () => {
      vi.spyOn(axios, 'post').mockRejectedValue(new Error('Network error'));

      await expect(
        saveProductAPI({ productData: {}, isEdit: false })
      ).rejects.toThrow('Network error');
    });
  });
});

describe('deleteProductAPI()', () => {
  it('should DELETE the product by id', async () => {
    vi.spyOn(axios, 'delete').mockResolvedValue({});

    await deleteProductAPI('prod-1');

    expect(axios.delete).toHaveBeenCalledWith('/api/products/prod-1');
  });

  it('should throw error on failure', async () => {
    vi.spyOn(axios, 'delete').mockRejectedValue(new Error('Network error'));

    await expect(deleteProductAPI('prod-1')).rejects.toThrow('Network error');
  });
});

describe('saveUserAPI()', () => {
  describe('When creating a new user', () => {
    it('should POST and return the created user', async () => {
      vi.spyOn(axios, 'post').mockResolvedValue({ data: MockUsers[0] });

      const result = await saveUserAPI({
        userData: MockUsers[0],
        isEdit: false,
      });

      expect(axios.post).toHaveBeenCalledWith('/api/admin/users', MockUsers[0]);
      expect(result).toEqual(MockUsers[0]);
    });
  });

  describe('When editing an existing user', () => {
    it('should PUT to the user endpoint and return the updated user', async () => {
      vi.spyOn(axios, 'put').mockResolvedValue({ data: MockUsers[0] });

      const result = await saveUserAPI({
        userData: MockUsers[0],
        isEdit: true,
        id: 'user-1',
      });

      expect(axios.put).toHaveBeenCalledWith(
        '/api/admin/users/user-1',
        MockUsers[0]
      );
      expect(result).toEqual(MockUsers[0]);
    });
  });
});

describe('deleteUserAPI()', () => {
  it('should DELETE the user by id', async () => {
    vi.spyOn(axios, 'delete').mockResolvedValue({});

    await deleteUserAPI('user-1');

    expect(axios.delete).toHaveBeenCalledWith('/api/admin/users/user-1');
  });
});

describe('updateOrderStatusAPI()', () => {
  it('should PUT to the order endpoint and return the updated order', async () => {
    const rawOrder = JSON.parse(JSON.stringify(MockOrders[0]));
    vi.spyOn(axios, 'put').mockResolvedValue({ data: rawOrder });

    const result = await updateOrderStatusAPI({
      id: 'order-1',
      status: 'Shipped',
      shipped_at: '2024-01-01T00:00:00Z',
    });

    expect(axios.put).toHaveBeenCalledWith('/api/admin/orders/order-1', {
      status: 'Shipped',
      shipped_at: '2024-01-01T00:00:00Z',
    });
    expect(result).toEqual(rawOrder);
  });

  it('should throw error on failure', async () => {
    vi.spyOn(axios, 'put').mockRejectedValue(new Error('Network error'));

    await expect(
      updateOrderStatusAPI({ id: 'order-1', status: 'Shipped' })
    ).rejects.toThrow('Network error');
  });
});
