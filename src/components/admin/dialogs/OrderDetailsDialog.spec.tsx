import { Order } from '@/entity/Orders/Orders';
import { MockOrders } from '@/entity/Orders/Orders.mock';
import { render, screen } from '@/src/utils/test';
import React from 'react';

import OrderDetailsDialog from './OrderDetailsDialog';

vi.mock('@/lib/api/admin/getAdminOrder', () => ({
  useGetAdminOrder: vi.fn(),
}));

import { useGetAdminOrder } from '@/lib/api/admin/getAdminOrder';

const mockUseGetAdminOrder = vi.mocked(useGetAdminOrder);

describe('OrderDetailsDialog', () => {
  const onClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not render content when closed', () => {
    mockUseGetAdminOrder.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<OrderDetailsDialog open={false} orderId="order-1" onClose={onClose} />);

    expect(screen.queryByText('Order Details')).not.toBeInTheDocument();
  });

  it('should show a loading indicator when fetching', () => {
    mockUseGetAdminOrder.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as any);

    render(<OrderDetailsDialog open={true} orderId="order-1" onClose={onClose} />);

    expect(screen.getByText('Loading order details...')).toBeInTheDocument();
  });

  it('should show an error message when the request fails', () => {
    mockUseGetAdminOrder.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('boom'),
    } as any);

    render(<OrderDetailsDialog open={true} orderId="order-1" onClose={onClose} />);

    expect(screen.getByText(/Failed to load order: boom/)).toBeInTheDocument();
  });

  it('should render order details when data is loaded', () => {
    mockUseGetAdminOrder.mockReturnValue({
      data: new Order(MockOrders[0]),
      isLoading: false,
      isError: false,
      error: null,
    } as any);

    render(<OrderDetailsDialog open={true} orderId="order-1" onClose={onClose} />);

    expect(screen.getByText('Order #order-1')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });
});
