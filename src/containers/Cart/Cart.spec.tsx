import * as GetProductAPI from '@/lib/api/products/getProduct';
import {
  act,
  mockPush,
  mockSignIn,
  mockUseCart,
  mockUseRouter,
  mockUseSession,
  render,
  renderHook,
  screen,
  waitFor,
} from '@/src/utils/test';
import { CartItem, IProduct } from '@/types/index';
import * as MaterialUI from '@mui/material';

import Cart from './Cart';
import { useCartPage } from './Cart.hooks';

const defaultCartCtx = {
  cart: [] as CartItem[],
  updateQuantity: vi.fn(),
  removeFromCart: vi.fn(),
  getCartTotal: vi.fn(() => 0),
  clearCart: vi.fn(),
  showSnackbar: vi.fn(),
  loading: false,
};

describe('Cart - Hooks', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
    } as any);

    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    mockUseCart.mockReturnValue(defaultCartCtx as any);

    vi.clearAllMocks();
    mockPush.mockClear();
    mockSignIn.mockClear();
  });

  it('should return default empty state', () => {
    const { result } = renderHook(() => useCartPage());

    expect(result.current.cart).toEqual([]);
    expect(result.current.products).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoadingProducts).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.cartLoading).toBe(false);
  });

  it('should navigate to products on handleContinueShopping', () => {
    const { result } = renderHook(() => useCartPage());

    act(() => {
      result.current.handleContinueShopping();
    });

    expect(mockPush).toHaveBeenCalledWith('/products');
  });

  it('should call signIn on handleCheckout when unauthenticated', () => {
    const { result } = renderHook(() => useCartPage());

    act(() => {
      result.current.handleCheckout();
    });

    expect(mockSignIn).toHaveBeenCalledWith(undefined, {
      callbackUrl: '/checkout',
    });
  });

  it('should navigate to checkout on handleCheckout when authenticated', () => {
    mockUseSession.mockReturnValue({
      data: { user: { email: 'test@test.com' } },
      status: 'authenticated',
    } as any);

    const { result } = renderHook(() => useCartPage());

    act(() => {
      result.current.handleCheckout();
    });

    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });
});

describe('Cart - UI', () => {
  const mockProducts: IProduct[] = [
    {
      ID: '1',
      name: 'Apple',
      price: 100,
      stock: 10,
      images: ['/apple.jpg'],
      description: 'Fresh apple',
      category: 'Fruit',
      discount: 0,
      isSeasonal: false,
      createdAt: '2025-01-01',
    },
    {
      ID: '2',
      name: 'Banana',
      price: 50,
      stock: 20,
      images: ['/banana.jpg'],
      description: 'Fresh banana',
      category: 'Fruit',
      discount: 5,
      isSeasonal: true,
      createdAt: '2025-01-01',
    },
  ];

  const mockCart: CartItem[] = [
    { productID: '1', quantity: 2 },
    { productID: '2', quantity: 1 },
  ];

  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
    } as any);

    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    } as any);

    mockUseCart.mockReturnValue(defaultCartCtx as any);

    vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
  });

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should match snapshot when cart is loading', () => {
      mockUseCart.mockReturnValue({
        ...defaultCartCtx,
        loading: true,
      } as any);

      const { container } = render(<Cart />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when cart is empty', () => {
      const { container } = render(<Cart />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with cart items', async () => {
      mockUseCart.mockReturnValue({
        ...defaultCartCtx,
        cart: mockCart,
      } as any);
      vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
        (id: string) => {
          const product = mockProducts.find((p) => p.ID === id);
          return Promise.resolve({ data: { product } } as any);
        }
      );

      const { container } = render(<Cart />);
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('when rendered in mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('should match snapshot when cart is loading', () => {
      mockUseCart.mockReturnValue({
        ...defaultCartCtx,
        loading: true,
      } as any);

      const { container } = render(<Cart />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot when cart is empty', () => {
      const { container } = render(<Cart />);
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with cart items', async () => {
      mockUseCart.mockReturnValue({
        ...defaultCartCtx,
        cart: mockCart,
      } as any);
      vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
        (id: string) => {
          const product = mockProducts.find((p) => p.ID === id);
          return Promise.resolve({ data: { product } } as any);
        }
      );

      const { container } = render(<Cart />);
      await waitFor(() => {
        expect(screen.getByText('Apple')).toBeInTheDocument();
      });
      expect(container).toMatchSnapshot();
    });
  });
});
