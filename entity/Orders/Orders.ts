import {
  Address,
  OrderItem,
  OrderStatus,
  Order as OrderType,
} from '@/types/index';

export class Order implements OrderType {
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

  constructor(data: OrderType) {
    this.id = data.id;
    this.userName = data.userName;
    this.items = data.items;
    this.total = data.total;
    this.createdAt = data.createdAt;
    this.status = data.status;
    this.payment_id = data.payment_id;
    this.razorpay_order_id = data.razorpay_order_id;
    this.shipped_at = data.shipped_at;
    this.delivered_at = data.delivered_at;
    this.cancelled_at = data.cancelled_at;
    this.shipping_address = data.shipping_address;
  }
}
