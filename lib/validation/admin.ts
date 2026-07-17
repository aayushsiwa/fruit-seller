import { IProduct, User } from '@/types/index';
import * as Yup from 'yup';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateProductData = (
  productData: Partial<
    Pick<IProduct, 'name' | 'price' | 'description' | 'category' | 'stock'>
  >
): ValidationResult => {
  if (!productData.name) {
    return { isValid: false, error: 'Product name is required' };
  }
  if (!productData.price || productData.price <= 0) {
    return { isValid: false, error: 'Price must be positive' };
  }
  if (!productData.description) {
    return { isValid: false, error: 'Description is required' };
  }
  if (!productData.category) {
    return { isValid: false, error: 'Category is required' };
  }
  if (productData.stock == null || productData.stock < 0) {
    return { isValid: false, error: 'Stock cannot be negative' };
  }
  return { isValid: true };
};

export const validateUserData = (
  userData: Partial<Pick<User, 'firstName' | 'lastName' | 'email' | 'role'>>
): ValidationResult => {
  if (!userData.firstName) {
    return { isValid: false, error: 'First name is required' };
  }
  if (!userData.lastName) {
    return { isValid: false, error: 'Last name is required' };
  }
  if (!userData.email || !userData.email.includes('@')) {
    return { isValid: false, error: 'Valid email is required' };
  }
  if (!userData.role) {
    return { isValid: false, error: 'Role is required' };
  }
  return { isValid: true };
};

export const productSchema = Yup.object({
  name: Yup.string().required('Product name is required'),
  price: Yup.number()
    .positive('Price must be positive')
    .required('Price is required'),
  description: Yup.string().required('Description is required'),
  discount: Yup.number()
    .min(0, 'Discount cannot be negative')
    .max(100, 'Discount cannot exceed 100%')
    .default(0),
  isSeasonal: Yup.boolean().default(false),
  category: Yup.string().required('Category is required'),
  stock: Yup.number()
    .integer('Stock must be a whole number')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  images: Yup.array().of(
    Yup.object({
      url: Yup.string().url('Must be a valid URL').required(),
      altText: Yup.string().required(),
    })
  ),
});

export const userSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  role: Yup.string().required('Role is required'),
});
