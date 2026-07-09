import { Product } from './Products';

export const MockProducts: Product[] = [
  {
    id: '1',
    name: 'Grapes',
    price: 100,
    discount: 10,
    stock: 20,
    image: '/grapes.jpg',
    description: 'Fresh Grapes from Nashik.',
    createdAt: '2025-05-01T00:00:00Z',
    category: 'berries',
    isSeasonal: true,
  },
  {
    id: '2',
    name: 'Apple',
    price: 50,
    discount: 5,
    stock: 0,
    image: '/apple.jpg',
    description: 'Organic Apples from Himachal.',
    createdAt: '2025-05-02T00:00:00Z',
    category: 'fruits',
    isSeasonal: false,
  },
];
