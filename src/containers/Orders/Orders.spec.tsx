import { MockOrders } from '@/entity/Orders/Orders.mock';
import * as GetOrdersAPI from '@/lib/api/orders/getOrders';
import { render, renderHook, waitFor } from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import * as NextRouter from 'next/router';

import Orders from './Orders';
import { useOrdersPage } from './Orders.hooks';

describe('Orders - Hooks', () => {
  let mockPush: any;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: {},
      } as Partial<Return> as Return;
    });

    vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
      data: { data: MockOrders },
      isLoading: false,
      error: null,
    } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);
  });

  it('should fetch orders on mount and set them', async () => {
    const { result } = renderHook(() => useOrdersPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.orders).toHaveLength(2);
    expect(result.current.orders[0].ID).toBe('order-1');
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network Error') as any,
    } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

    const { result } = renderHook(() => useOrdersPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.orders).toHaveLength(0);
    expect(result.current.error).toBe('Network Error');
  });

  it('should navigate on handleViewOrder / handleContinueShopping', async () => {
    const { result } = renderHook(() => useOrdersPage());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    result.current.handleViewOrder('order-1');
    expect(mockPush).toHaveBeenCalledWith('/orders/order-1');

    result.current.handleContinueShopping();
    expect(mockPush).toHaveBeenCalledWith('/products');
  });
});

describe('Orders - UI', () => {
  let mockPush: any;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: {},
      } as Partial<Return> as Return;
    });
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

      const { container } = render(<Orders />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', () => {
      vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
        data: { data: MockOrders },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

      const { container } = render(<Orders />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network Error') as any,
      } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

      const { container } = render(<Orders />);
      expect(container).toMatchSnapshot();
    });
  });

  describe('when rendered in mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

      const { container } = render(<Orders />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', () => {
      vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
        data: { data: MockOrders },
        isLoading: false,
        error: null,
      } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

      const { container } = render(<Orders />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', () => {
      vi.spyOn(GetOrdersAPI, 'useGetOrders').mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network Error') as any,
      } as unknown as ReturnType<typeof GetOrdersAPI.useGetOrders>);

      const { container } = render(<Orders />);
      expect(container).toMatchSnapshot();
    });
  });
});
