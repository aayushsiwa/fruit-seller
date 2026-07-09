import { IProduct } from '@/entity/Products/Products';
import { DefaultSession } from 'next-auth';
import React from 'react';

export type OrderStatus = 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export const ORDER_STATUSES: OrderStatus[] = [
  'Processing',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export interface CartItem {
  id: string;
  quantity: number;
}

export interface OrderItem {
  quantity: number;
  product: IProduct;
}

export interface Address {
  id?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  userName: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: OrderStatus;
  payment_id?: string;
  razorpay_order_id?: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  shipping_address?: Address;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
}

export enum TabValue {
  PRODUCTS = 0,
  USERS = 1,
  ORDERS = 2,
}

export interface SessionUser {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    cart_id?: string;
  };
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    cart_id?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      role: string;
      cart_id?: string;
    };
  }
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type { IProduct };

export interface LayoutProps {
  children: React.ReactNode;
}
