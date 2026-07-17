import { Product } from './Products';

export const MockProducts: Product[] = [
  {
    ID: '1',
    name: 'Grapes',
    slug: 'grapes',
    price: 100,
    discount: 10,
    stock: 20,
    images: [{ url: '/grapes.jpg', altText: 'Fresh Grapes' }],
    description: 'Fresh Grapes from Nashik.',
    createdAt: '2025-05-01T00:00:00Z',
    category: 'berries',
    isSeasonal: true,
  },
  {
    ID: '2',
    name: 'Apple',
    slug: 'apple',
    price: 50,
    discount: 5,
    stock: 0,
    images: [{ url: '/apple.jpg', altText: 'Organic Apple' }],
    description: 'Organic Apples from Himachal.',
    createdAt: '2025-05-02T00:00:00Z',
    category: 'fruits',
    isSeasonal: false,
  },
];
