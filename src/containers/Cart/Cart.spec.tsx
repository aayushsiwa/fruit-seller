import { useCart } from '@/src/contexts/CartContext';
import { CartItem, ItemType } from '@/types/index';
import { useQueries } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Cart from './Cart';
import { useCartPage } from './Cart.hooks';

jest.mock('framer-motion', () => {
  const FakeMotion = ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  );
  FakeMotion.displayName = 'FakeMotion';
  const motion = new Proxy(
    function MotionComponent(_tag: string) {
      const Inner = ({ children }: { children: React.ReactNode }) => (
        <>{children}</>
      );
      Inner.displayName = `motion.${_tag}`;
      return Inner;
    },
    { get: () => FakeMotion }
  );
  return {
    motion,
    AnimatePresence: FakeMotion,
  };
});

jest.mock('next/router', () => ({ useRouter: jest.fn() }));
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}));
jest.mock('@/src/contexts/CartContext', () => ({ useCart: jest.fn() }));
jest.mock('axios');
jest.mock('@tanstack/react-query', () => ({ useQueries: jest.fn() }));

jest.mock('./Cart.styles', () => ({
  __esModule: true,
  default: () => ({}),
}));

jest.mock('@/src/components/LoadingScreen', () => ({
  __esModule: true,
  LoadingScreen: () => <div data-testid="loading-screen" />,
}));

jest.mock('@/src/components/Cart/CartItems', () => ({
  __esModule: true,
  CartItems: () => <div data-testid="cart-items" />,
}));

jest.mock('@/src/components/Cart/OrderSummary', () => ({
  __esModule: true,
  OrderSummary: () => <div data-testid="order-summary" />,
}));

jest.mock('@/src/components/Cart/EmptyCart', () => ({
  __esModule: true,
  EmptyCart: () => <div data-testid="empty-cart" />,
}));

const mockPush = jest.fn();
const mockSignIn = signIn as unknown as jest.Mock;

const defaultCartCtx = {
  cart: [] as CartItem[],
  updateQuantity: jest.fn(),
  removeFromCart: jest.fn(),
  getCartTotal: jest.fn(),
  clearCart: jest.fn(),
  showSnackbar: jest.fn(),
  loading: false,
};

function setupDefaultMocks() {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    prefetch: jest.fn(),
  });
  (useSession as jest.Mock).mockReturnValue({
    data: null,
    status: 'unauthenticated',
  });
  (useCart as jest.Mock).mockReturnValue(defaultCartCtx);
  (useQueries as jest.Mock).mockReturnValue([]);
  jest.clearAllMocks();
  mockPush.mockClear();
  mockSignIn.mockClear();
}

describe('Cart - Hooks', () => {
  beforeEach(setupDefaultMocks);

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
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: 'test@test.com' } },
      status: 'authenticated',
    });

    const { result } = renderHook(() => useCartPage());

    act(() => {
      result.current.handleCheckout();
    });

    expect(mockPush).toHaveBeenCalledWith('/checkout');
  });
});

describe('Cart - UI', () => {
  const mockProducts: ItemType[] = [
    {
      id: '1',
      name: 'Apple',
      price: 100,
      quantity: 10,
      image: 'apple.jpg',
      description: 'Fresh apple',
      category: 'Fruit',
      discount: 0,
      isSeasonal: false,
      createdAt: '2025-01-01',
    },
    {
      id: '2',
      name: 'Banana',
      price: 50,
      quantity: 20,
      image: 'banana.jpg',
      description: 'Fresh banana',
      category: 'Fruit',
      discount: 5,
      isSeasonal: true,
      createdAt: '2025-01-01',
    },
  ];

  const mockCart: CartItem[] = [
    { id: '1', quantity: 2 },
    { id: '2', quantity: 1 },
  ];

  beforeEach(setupDefaultMocks);

  it('should render loading state', () => {
    (useCart as jest.Mock).mockReturnValue({
      ...defaultCartCtx,
      loading: true,
    });

    render(<Cart />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('should render empty cart state', () => {
    render(<Cart />);
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument();
  });

  it('should match snapshot with cart items', () => {
    (useCart as jest.Mock).mockReturnValue({
      ...defaultCartCtx,
      cart: mockCart,
    });
    (useQueries as jest.Mock).mockReturnValue(
      mockCart.map((_item, i) => ({
        data: mockProducts[i],
        isLoading: false,
        error: null,
      }))
    );

    const { container } = render(<Cart />);
    expect(container).toMatchSnapshot();
  });
});
