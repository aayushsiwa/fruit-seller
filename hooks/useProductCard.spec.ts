import {
  act,
  mockAddToCart,
  mockPush,
  mockRemoveFromCart,
  mockUpdateQuantity,
  mockUseCart,
  mockUseRouter,
  renderHook,
} from '@/src/utils/test';
import { IProduct } from '@/types/index';

import useProductCard from './useProductCard';

const mockProduct: IProduct = {
  id: 'p1',
  name: 'Apple',
  price: 100,
  stock: 10,
  image: '/apple.jpg',
  description: 'Fresh apple',
  category: 'Fruit',
  discount: 20,
  isSeasonal: false,
  createdAt: '2025-01-01',
};

const mockProductNoDiscount: IProduct = {
  ...mockProduct,
  id: 'p2',
  discount: 0,
};
const mockProductOutOfStock: IProduct = {
  ...mockProduct,
  id: 'p3',
  stock: 0,
};

const cartMock = {
  cart: [],
  addToCart: mockAddToCart,
  updateQuantity: mockUpdateQuantity,
  removeFromCart: mockRemoveFromCart,
  getCartTotal: vi.fn(),
  getCartItemCount: vi.fn(),
  clearCart: vi.fn(),
  loading: false,
  showSnackbar: vi.fn(),
};

describe('useProductCard', () => {
  beforeEach(() => {
    (mockUseCart as any).mockReturnValue(cartMock);
    (mockUseRouter as any).mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
      pathname: '/products',
      query: {},
      asPath: '/products',
    });
  });

  it('calculates discounted price when discount > 0', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    // 100 * (1 - 20/100) = 80
    expect(result.current.discountedPrice).toBe(80);
  });

  it('returns null discountedPrice when discount is 0', () => {
    const { result } = renderHook(() => useProductCard(mockProductNoDiscount));
    expect(result.current.discountedPrice).toBeNull();
  });

  it('reports out of stock correctly', () => {
    const { result } = renderHook(() => useProductCard(mockProductOutOfStock));
    expect(result.current.isOutOfStock).toBe(true);
  });

  it('reports in stock correctly', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    expect(result.current.isOutOfStock).toBe(false);
  });

  it('reads cartQuantity from cart context', () => {
    (mockUseCart as any).mockReturnValue({
      ...cartMock,
      cart: [{ id: 'p1', quantity: 3 }] as any,
    });
    const { result } = renderHook(() => useProductCard(mockProduct));
    expect(result.current.cartQuantity).toBe(3);
  });

  it('returns 0 cartQuantity when product not in cart', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    expect(result.current.cartQuantity).toBe(0);
  });

  it('handleAddToCart calls addToCart with product and quantity 1', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleAddToCart({ stopPropagation: vi.fn() } as any);
    });
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('handleViewDetails pushes to product detail route', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleViewDetails();
    });
    expect(mockPush).toHaveBeenCalledWith('/products/p1');
  });

  it('handleQuantityChange removes product when newQuantity <= 0', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleQuantityChange(
        { stopPropagation: vi.fn() } as any,
        0
      );
    });
    expect(mockRemoveFromCart).toHaveBeenCalledWith('p1');
  });

  it('handleQuantityChange updates quantity within stock bounds', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleQuantityChange(
        { stopPropagation: vi.fn() } as any,
        5
      );
    });
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 5, 10);
  });

  it('handleQuantityChange does nothing when newQuantity > product.stock', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleQuantityChange(
        { stopPropagation: vi.fn() } as any,
        999
      );
    });
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
    expect(mockRemoveFromCart).not.toHaveBeenCalled();
  });

  it('handleInputChange removes from cart when input is 0', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleInputChange({
        stopPropagation: vi.fn(),
        target: { value: '0' },
      } as any);
    });
    expect(mockRemoveFromCart).toHaveBeenCalledWith('p1');
  });

  it('handleInputChange updates quantity when input is valid', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleInputChange({
        stopPropagation: vi.fn(),
        target: { value: '4' },
      } as any);
    });
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 4, 10);
  });

  it('handleInputChange ignores non-numeric input', () => {
    const { result } = renderHook(() => useProductCard(mockProduct));
    act(() => {
      result.current.handleInputChange({
        stopPropagation: vi.fn(),
        target: { value: 'abc' },
      } as any);
    });
    expect(mockUpdateQuantity).not.toHaveBeenCalled();
    expect(mockRemoveFromCart).not.toHaveBeenCalled();
  });
});
