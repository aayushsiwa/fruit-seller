import {
  productSchema,
  userSchema,
  validateProductData,
  validateUserData,
} from './admin';

describe('Admin Validation Helpers', () => {
  describe('validateProductData()', () => {
    it('should validate complete product data', () => {
      const result = validateProductData({
        name: 'Apple',
        price: 50,
        description: 'Fresh apple',
        category: 'fruits',
        stock: 10,
      });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail if name is missing', () => {
      const result = validateProductData({
        price: 50,
        description: 'Fresh apple',
        category: 'fruits',
        stock: 10,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Product name is required');
    });

    it('should fail if price is missing or non-positive', () => {
      const result = validateProductData({
        name: 'Apple',
        price: 0,
        description: 'Fresh apple',
        category: 'fruits',
        stock: 10,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Price must be positive');
    });

    it('should fail if description is missing', () => {
      const result = validateProductData({
        name: 'Apple',
        price: 50,
        category: 'fruits',
        stock: 10,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Description is required');
    });

    it('should fail if category is missing', () => {
      const result = validateProductData({
        name: 'Apple',
        price: 50,
        description: 'Fresh apple',
        stock: 10,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Category is required');
    });

    it('should fail if quantity is missing or negative', () => {
      const result = validateProductData({
        name: 'Apple',
        price: 50,
        description: 'Fresh apple',
        category: 'fruits',
        stock: -1,
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Stock cannot be negative');
    });
  });

  describe('validateUserData()', () => {
    it('should validate complete user data', () => {
      const result = validateUserData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
      });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail if firstName is missing', () => {
      const result = validateUserData({
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'user',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('First name is required');
    });

    it('should fail if lastName is missing', () => {
      const result = validateUserData({
        firstName: 'John',
        email: 'john@example.com',
        role: 'user',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Last name is required');
    });

    it('should fail if email is invalid or missing', () => {
      const result = validateUserData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        role: 'user',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Valid email is required');
    });

    it('should fail if role is missing', () => {
      const result = validateUserData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Role is required');
    });
  });

  describe('Yup Schemas', () => {
    it('should validate product schema correctly', async () => {
      const validProduct = {
        name: 'Apple',
        price: 50,
        description: 'Fresh apple',
        category: 'fruits',
        stock: 10,
        discount: 5,
        isSeasonal: true,
        image: 'https://example.com/apple.jpg',
      };
      await expect(productSchema.validate(validProduct)).resolves.toEqual(
        validProduct
      );
    });

    it('should validate user schema correctly', async () => {
      const validUser = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        role: 'admin',
      };
      await expect(userSchema.validate(validUser)).resolves.toEqual(validUser);
    });
  });
});
