import { MockProducts } from '@/entity/Products/Products.mock';
import { render, screen } from '@/src/utils/test';
import { CartItem } from '@/types/index';
import React from 'react';

import { CartItems } from './CartItems';

const cart: CartItem[] = [{ id: '1', quantity: 2 }];

const defaultProps = {
  cart,
  products: [MockProducts[0]],
  handleQuantityChange: vi.fn(),
  handleRemoveItem: vi.fn(),
  isLoadingProducts: false,
  hasError: false,
};

describe('CartItems', () => {
  it('shows a loading message while products load', () => {
    render(<CartItems {...defaultProps} isLoadingProducts />);

    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('shows an error message when it fails to load products', () => {
    render(<CartItems {...defaultProps} hasError />);

    expect(
      screen.getByText('Failed to load some product details.')
    ).toBeInTheDocument();
  });

  it('renders cart items with product info', () => {
    render(<CartItems {...defaultProps} />);

    expect(screen.getByTestId('cart-items')).toBeInTheDocument();
    expect(screen.getByText(MockProducts[0].name)).toBeInTheDocument();
  });
});
