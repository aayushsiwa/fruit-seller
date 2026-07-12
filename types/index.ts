import { IProduct } from '@/entity/Products/Products';
import { DefaultSession } from 'next-auth';
import React from 'react';

export type OrderStatus = 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export const ORDER_STATUSES: OrderStatus[] = [
  'PROCESSING',
  'PAID',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
];

export interface CartItem {
  productID: string;
  quantity: number;
}

export interface OrderItem {
  quantity: number;
  product: IProduct;
}

export interface Address {
  ID?: string;
  label?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  ID: string;
  userName: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  paymentID?: string;
  razorpayOrderID?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  shippingAddress?: Address;
}

export type UserRole = 'USER' | 'ADMIN';

export const USER_ROLES: UserRole[] = ['USER', 'ADMIN'];

export interface User {
  ID: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export enum TabValue {
  PRODUCTS = 0,
  USERS = 1,
  ORDERS = 2,
}

export interface SessionUser {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: UserRole;
  };
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: UserRole;
  }
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id?: string;
      role: UserRole;
    };
  }
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ProductImage {
  url: string;
  altText: string;
}

export type { IProduct };

export interface LayoutProps {
  children: React.ReactNode;
}
