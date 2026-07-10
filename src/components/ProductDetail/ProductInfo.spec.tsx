import { MockProducts } from '@/entity/Products/Products.mock';
import { render, screen } from '@/src/utils/test';
import React from 'react';

import { ProductInfo } from './ProductInfo';

const defaultProps = {
  product: MockProducts[0],
  isMobile: false,
  cartQuantity: 0,
  error: null,
  setError: vi.fn(),
  handleAddToCart: vi.fn(),
  handleQuantityChange: vi.fn(),
  handleShare: vi.fn(),
  isFavorite: false,
  handleToggleFavorite: vi.fn(),
};

describe('ProductInfo', () => {
  it('renders product name and description', () => {
    render(<ProductInfo {...defaultProps} />);

    expect(screen.getByText(MockProducts[0].name)).toBeInTheDocument();
    expect(screen.getByText(MockProducts[0].description)).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<ProductInfo {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('shows the add to cart button when quantity is zero', () => {
    render(<ProductInfo {...defaultProps} cartQuantity={0} />);

    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('renders an error alert when error is present', () => {
    render(<ProductInfo {...defaultProps} error="Out of stock" />);

    expect(screen.getByText('Out of stock')).toBeInTheDocument();
  });
});
