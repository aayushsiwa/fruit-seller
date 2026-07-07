import { ItemType, Order } from '@/types/index';
import { render, renderHook, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import * as nextRouter from 'next/router';

import OrderDetailPage from './OrderDetail';
import { useOrderDetailPage } from './OrderDetail.hooks';

jest.mock('framer-motion', () => {
  const FakeMotion = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  return {
    motion: new Proxy(FakeMotion, {
      get: () => FakeMotion,
    }),
    AnimatePresence: FakeMotion,
  };
});

jest.mock('@/src/components/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

jest.mock('@/src/components/Success/ErrorMessage', () => ({
  ErrorMessage: ({
    message,
    onRetry,
  }: {
    message: string;
    onRetry: () => void;
  }) => (
    <div data-testid="error-message">
      <span>{message}</span>
      <button onClick={onRetry}>Try Again</button>
    </div>
  ),
}));

jest.mock('@/src/components/OrderDetail/OrderDetailsEnhanced', () => ({
  OrderDetailsEnhanced: ({ order }: { order: Order }) => (
    <div data-testid="order-details-enhanced">
      Order #{order.id.slice(0, 8)}
    </div>
  ),
}));

jest.mock('dayjs', () => {
  const dayjsFn = () => ({ fromNow: () => 'a few days ago' });
  dayjsFn.extend = jest.fn();
  return dayjsFn;
});
jest.mock('dayjs/plugin/relativeTime', () => jest.fn());

const mockOrder: Order = {
  id: 'order-123',
  userName: 'John Doe',
  items: [{ id: 'p1', quantity: 2 }],
  total: 199.99,
  createdAt: '2025-06-15T10:00:00Z',
  status: 'Processing',
};

const mockProducts: ItemType[] = [
  {
    id: 'p1',
    name: 'Apple',
    price: 50,
    quantity: 10,
    image: '/apple.jpg',
    description: 'Fresh apple',
    category: 'fruits',
    discount: 0,
    isSeasonal: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

describe('OrderDetail - Hooks', () => {
  let axiosGetSpy: jest.SpyInstance;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: mockPush,
      query: { orderId: 'order-123' },
    } as unknown as nextRouter.NextRouter);

    axiosGetSpy = jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: mockOrder, status: 200 })
      .mockResolvedValueOnce({ data: mockProducts[0], status: 200 });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch order and products on mount', async () => {
    const { result } = renderHook(() => useOrderDetailPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.order).toEqual(mockOrder);
    expect(axiosGetSpy).toHaveBeenCalledWith('/api/orders/order-123');
  });

  it('should handle error', async () => {
    axiosGetSpy.mockReset();
    axiosGetSpy.mockRejectedValueOnce(new Error('Not found'));

    const { result } = renderHook(() => useOrderDetailPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Not found');
    expect(result.current.order).toBeNull();
  });

  it('should navigate back on handleBackToOrders', async () => {
    const { result } = renderHook(() => useOrderDetailPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.handleBackToOrders();
    expect(mockPush).toHaveBeenCalledWith('/orders');
  });
});

describe('OrderDetail - UI', () => {
  let axiosGetSpy: jest.SpyInstance;
  let mockPush: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    jest.spyOn(nextRouter, 'useRouter').mockReturnValue({
      push: mockPush,
      query: { orderId: 'order-123' },
    } as unknown as nextRouter.NextRouter);

    axiosGetSpy = jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render loading state', () => {
    axiosGetSpy.mockImplementationOnce(() => new Promise(() => {}));

    render(<OrderDetailPage />);

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('should render error state', async () => {
    axiosGetSpy.mockRejectedValueOnce(new Error('Something went wrong'));

    render(<OrderDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toBeInTheDocument();
    });

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should match snapshot with order data', async () => {
    axiosGetSpy
      .mockResolvedValueOnce({ data: mockOrder, status: 200 })
      .mockResolvedValueOnce({ data: mockProducts[0], status: 200 });

    const { asFragment } = render(<OrderDetailPage />);

    await waitFor(() => {
      expect(screen.getByTestId('order-details-enhanced')).toBeInTheDocument();
    });

    expect(asFragment()).toMatchSnapshot();
  });
});
