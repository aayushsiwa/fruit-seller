import { MockOrders } from '@/entity/Orders/Orders.mock';
import { MockProducts } from '@/entity/Products/Products.mock';
import * as GetOrderAPI from '@/lib/api/orders/getOrder';
import * as GetProductAPI from '@/lib/api/products/getProduct';
import { act, render, renderHook, screen, waitFor } from '@/src/utils/test';
import * as MaterialUI from '@mui/material';
import * as NextRouter from 'next/router';

import Success from './Success';
import { useSuccess } from './Success.hooks';

const mockOrder = MockOrders[0];
const mockProduct = MockProducts[0];

describe('Success - Hooks', () => {
  let mockPush: any;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: { orderId: 'order-1' },
      } as Partial<Return> as Return;
    });

    vi.spyOn(GetOrderAPI, 'getOrderAPI').mockResolvedValue({
      data: mockOrder,
    } as any);
    vi.spyOn(GetProductAPI, 'getProductAPI').mockResolvedValue({
      data: { product: mockProduct },
    } as any);
  });

  it('should fetch order by orderId from query', async () => {
    const { result } = renderHook(() => useSuccess());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.order).toEqual(mockOrder);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    vi.spyOn(GetOrderAPI, 'getOrderAPI').mockRejectedValue(
      new Error('Network error')
    );

    const { result } = renderHook(() => useSuccess());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.order).toBeNull();
  });

  it('should navigate on handleContinueShopping', async () => {
    const { result } = renderHook(() => useSuccess());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.handleContinueShopping();
    });

    expect(mockPush).toHaveBeenCalledWith('/products');
  });
});

describe('Success - UI', () => {
  let mockPush: any;

  beforeEach(() => {
    mockPush = vi.fn();
    vi.spyOn(NextRouter, 'useRouter').mockImplementation(() => {
      type Return = ReturnType<typeof NextRouter.useRouter>;
      return {
        push: mockPush,
        query: { orderId: 'order-1' },
      } as Partial<Return> as Return;
    });
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetOrderAPI, 'getOrderAPI').mockImplementation(
        () => new Promise(() => {})
      );
      vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
        () => new Promise(() => {})
      );

      const { container } = render(<Success />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', async () => {
      vi.spyOn(GetOrderAPI, 'getOrderAPI').mockResolvedValue({
        data: mockOrder,
      } as any);
      vi.spyOn(GetProductAPI, 'getProductAPI').mockResolvedValue({
        data: { product: mockProduct },
      } as any);

      const { container } = render(<Success />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', async () => {
      vi.spyOn(GetOrderAPI, 'getOrderAPI').mockRejectedValueOnce(
        new Error('Something went wrong')
      );

      const { container } = render(<Success />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });
  });

  describe('when rendered in mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('should match snapshot when API is loading', () => {
      vi.spyOn(GetOrderAPI, 'getOrderAPI').mockImplementation(
        () => new Promise(() => {})
      );
      vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
        () => new Promise(() => {})
      );

      const { container } = render(<Success />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API is successful', async () => {
      vi.spyOn(GetOrderAPI, 'getOrderAPI').mockResolvedValue({
        data: mockOrder,
      } as any);
      vi.spyOn(GetProductAPI, 'getProductAPI').mockResolvedValue({
        data: { product: mockProduct },
      } as any);

      const { container } = render(<Success />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when API fails', async () => {
      vi.spyOn(GetOrderAPI, 'getOrderAPI').mockRejectedValueOnce(
        new Error('Something went wrong')
      );

      const { container } = render(<Success />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(container).toMatchSnapshot();
    });
  });
});
