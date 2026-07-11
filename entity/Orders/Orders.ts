import {
  Address,
  OrderItem,
  OrderStatus,
  Order as OrderType,
} from '@/types/index';

export class Order implements OrderType {
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

  constructor(data: OrderType) {
    this.ID = data.ID;
    this.userName = data.userName;
    this.items = data.items;
    this.total = data.total;
    this.createdAt = data.createdAt;
    this.status = data.status;
    this.paymentID = data.paymentID;
    this.razorpayOrderID = data.razorpayOrderID;
    this.shippedAt = data.shippedAt;
    this.deliveredAt = data.deliveredAt;
    this.cancelledAt = data.cancelledAt;
    this.shippingAddress = data.shippingAddress;
  }
}
