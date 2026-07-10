import { MockOrders } from '@/entity/Orders/Orders.mock';
import { render, screen } from '@/src/utils/test';
import React from 'react';

import OrderDialog from './OrderDialog';

const defaultProps = {
  open: true,
  order: MockOrders[0],
  onClose: vi.fn(),
  onUpdateStatus: vi.fn(),
  onOrderChange: vi.fn(),
  isLoading: false,
};

describe('OrderDialog', () => {
  it('renders order details and the status selector', () => {
    render(<OrderDialog {...defaultProps} />);

    expect(screen.getByText('Update Order Status')).toBeInTheDocument();
    expect(screen.getByText(/order-1/)).toBeInTheDocument();
    expect(screen.getByText('Update Status')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(<OrderDialog {...defaultProps} />);
    expect(container).toMatchSnapshot();
  });

  it('shows terminal state message when no transitions are allowed', () => {
    render(<OrderDialog {...defaultProps} order={MockOrders[1]} />);

    expect(screen.getByText(/terminal state/)).toBeInTheDocument();
    expect(screen.queryByText('Update Status')).not.toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(<OrderDialog {...defaultProps} open={false} />);

    expect(screen.queryByText('Update Order Status')).not.toBeInTheDocument();
  });
});
