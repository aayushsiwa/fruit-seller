import { MockProducts } from '@/entity/Products/Products.mock';

import { Order } from './Orders';

export const MockOrders: Order[] = [
  {
    ID: 'order-1',
    userName: 'John Doe',
    items: [
      { quantity: 2, product: MockProducts[0] },
      { quantity: 1, product: MockProducts[1] },
    ],
    total: 250.5,
    createdAt: '2025-06-01T10:00:00Z',
    status: 'PROCESSING',
  },
  {
    ID: 'order-2',
    userName: 'Jane Doe',
    items: [{ quantity: 1, product: MockProducts[0] }],
    total: 99.99,
    createdAt: '2025-05-15T08:30:00Z',
    status: 'DELIVERED',
  },
];
