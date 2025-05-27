import { ItemType, User } from "@/types";

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateProductData = (productData: Partial<ItemType>): ValidationResult => {
  if (!productData.name) {
    return { isValid: false, error: "Product name is required" };
  }
  if (!productData.price || productData.price <= 0) {
    return { isValid: false, error: "Price must be positive" };
  }
  if (!productData.description) {
    return { isValid: false, error: "Description is required" };
  }
  if (!productData.category) {
    return { isValid: false, error: "Category is required" };
  }
  if (productData.quantity == null || productData.quantity < 0) {
    return { isValid: false, error: "Quantity cannot be negative" };
  }
  return { isValid: true };
};

export const validateUserData = (userData: Partial<User>): ValidationResult => {
  if (!userData.firstName) {
    return { isValid: false, error: "First name is required" };
  }
  if (!userData.lastName) {
    return { isValid: false, error: "Last name is required" };
  }
  if (!userData.email || !userData.email.includes("@")) {
    return { isValid: false, error: "Valid email is required" };
  }
  if (!userData.role) {
    return { isValid: false, error: "Role is required" };
  }
  return { isValid: true };
};