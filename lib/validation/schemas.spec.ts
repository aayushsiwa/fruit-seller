import { loginSchema } from './loginSchema';
import { NewsletterSchema } from './newsletterSchema';
import { registerSchema } from './registerSchema';

describe('Yup Validation Schemas', () => {
  describe('loginSchema', () => {
    it('should validate valid login credentials', async () => {
      const valid = {
        email: 'test@example.com',
        password: 'Password123',
      };
      await expect(loginSchema.validate(valid)).resolves.toEqual(valid);
    });

    it('should reject invalid email format', async () => {
      const invalid = {
        email: 'invalid-email',
        password: 'Password123',
      };
      await expect(loginSchema.validate(invalid)).rejects.toThrow(
        'Invalid email address'
      );
    });
  });

  describe('NewsletterSchema', () => {
    it('should validate valid email', async () => {
      const valid = { email: 'test@example.com' };
      await expect(NewsletterSchema.validate(valid)).resolves.toEqual(valid);
    });

    it('should reject invalid email', async () => {
      const invalid = { email: 'not-an-email' };
      await expect(NewsletterSchema.validate(invalid)).rejects.toThrow(
        'Please enter a valid email address'
      );
    });
  });

  describe('registerSchema', () => {
    it('should validate a valid registration data', async () => {
      const valid = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password1!',
        confirmPassword: 'Password1!',
        agreeTerms: true,
      };
      await expect(registerSchema.validate(valid)).resolves.toEqual({
        ...valid,
        email: 'john@example.com',
      });
    });

    it('should reject passwords that do not match', async () => {
      const invalid = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Password1!',
        confirmPassword: 'DifferentPassword!',
        agreeTerms: true,
      };
      await expect(registerSchema.validate(invalid)).rejects.toThrow(
        'Passwords must match'
      );
    });
  });
});
