import { MockProducts } from '@/entity/Products/Products.mock';
import { render, screen } from '@/src/utils/test';
import { CartItem } from '@/types/index';
import React from 'react';

import { OrderSummary } from './OrderSummary';

const cart: CartItem[] = [{ id: '1', quantity: 2 }];

const defaultProps = {
  cart,
  products: [MockProducts[0]],
  getCartTotal: vi.fn(() => 100),
  handlePayNow: vi.fn(),
  handleCheckout: vi.fn(),
  processing: false,
  hasError: false,
};

describe('Checkout OrderSummary', () => {
  it('renders the order summary with totals', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByTestId('order-summary')).toBeInTheDocument();
    expect(screen.getByText('Order Summary')).toBeInTheDocument();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<OrderSummary {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('renders the pay now button when not processing', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByText('Pay Now')).toBeInTheDocument();
  });
});
