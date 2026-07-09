import ProductCard from '@/src/components/ProductCard';
import { IProduct } from '@/types/index';
import { render } from '@testing-library/react';
import React from 'react';

vi.mock('next/router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock('@/src/contexts/CartContext', () => ({
  useCart: () => ({
    cart: [],
    addToCart: vi.fn(),
    updateQuantity: vi.fn(),
    removeFromCart: vi.fn(),
  }),
}));

const sampleProduct: IProduct = {
  id: '1',
  name: 'Grapes',
  price: 100,
  discount: 10,
  stock: 20,
  image: '/grapes.jpg',
  description: 'Fresh Grapes from Nashik.',
  createdAt: '2025-05-01T00:00:00Z',
  category: 'fruits',
  isSeasonal: true,
};

describe('ProductCard Snapshot', () => {
  it('renders correctly and matches snapshot', () => {
    const { asFragment } = render(<ProductCard product={sampleProduct} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
