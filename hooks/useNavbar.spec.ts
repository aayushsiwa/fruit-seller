import {
  act,
  mockGetCartItemCount,
  mockPush,
  mockSignOut,
  mockUseCart,
  mockUseRouter,
  mockUseSession,
  renderHook,
} from '@/src/utils/test';

import { useNavbar } from './useNavbar';

describe('useNavbar', () => {
  beforeEach(() => {
    (mockUseSession as any).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
    (mockUseRouter as any).mockReturnValue({
      push: mockPush,
      prefetch: vi.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    });
    (mockUseCart as any).mockReturnValue({
      cart: [],
      addToCart: vi.fn(),
      updateQuantity: vi.fn(),
      removeFromCart: vi.fn(),
      getCartTotal: vi.fn(),
      getCartItemCount: mockGetCartItemCount,
      clearCart: vi.fn(),
      loading: false,
      showSnackbar: vi.fn(),
    });
  });

  it('returns initial state with no user session', () => {
    const { result } = renderHook(() => useNavbar());
    expect(result.current.user).toBeUndefined();
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.drawerOpen).toBe(false);
    expect(result.current.anchorEl).toBeNull();
    expect(result.current.searchQuery).toBe('');
    expect(result.current.isScrolled).toBe(false);
  });

  it('sets isAdmin true when user role is admin', () => {
    (mockUseSession as any).mockReturnValue({
      data: { user: { name: 'Admin', email: 'a@a.com', role: 'admin' } } as any,
      status: 'authenticated',
    });
    const { result } = renderHook(() => useNavbar());
    expect(result.current.isAdmin).toBe(true);
  });

  it('toggles drawerOpen on handleDrawerToggle', () => {
    const { result } = renderHook(() => useNavbar());
    expect(result.current.drawerOpen).toBe(false);
    act(() => result.current.handleDrawerToggle());
    expect(result.current.drawerOpen).toBe(true);
    act(() => result.current.handleDrawerToggle());
    expect(result.current.drawerOpen).toBe(false);
  });

  it('sets anchorEl on handleProfileMenuOpen', () => {
    const { result } = renderHook(() => useNavbar());
    const fakeEl = document.createElement('button');
    act(() => {
      result.current.handleProfileMenuOpen({ currentTarget: fakeEl } as any);
    });
    expect(result.current.anchorEl).toBe(fakeEl);
  });

  it('clears anchorEl on handleMenuClose', () => {
    const { result } = renderHook(() => useNavbar());
    const fakeEl = document.createElement('button');
    act(() => {
      result.current.handleProfileMenuOpen({ currentTarget: fakeEl } as any);
    });
    act(() => result.current.handleMenuClose());
    expect(result.current.anchorEl).toBeNull();
  });

  it('handleLogout calls signOut', () => {
    const { result } = renderHook(() => useNavbar());
    act(() => result.current.handleLogout());
    expect(mockSignOut).toHaveBeenCalled();
  });

  it('handleNavigation pushes to path and closes drawer', () => {
    const { result } = renderHook(() => useNavbar());
    act(() => result.current.handleDrawerToggle());
    expect(result.current.drawerOpen).toBe(true);
    act(() => result.current.handleNavigation('/cart'));
    expect(mockPush).toHaveBeenCalledWith('/cart');
    expect(result.current.drawerOpen).toBe(false);
  });

  it('handleSearch pushes to products page on Enter with a non-empty query', () => {
    const { result } = renderHook(() => useNavbar());
    act(() => result.current.setSearchQuery('mango'));
    act(() => {
      result.current.handleSearch({ key: 'Enter' } as any);
    });
    expect(mockPush).toHaveBeenCalledWith('/products?search=mango');
    expect(result.current.searchQuery).toBe('');
  });

  it('handleSearch does nothing when key is not Enter', () => {
    const { result } = renderHook(() => useNavbar());
    act(() => result.current.setSearchQuery('mango'));
    act(() => {
      result.current.handleSearch({ key: 'a' } as any);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('handleSearch does nothing with empty query', () => {
    const { result } = renderHook(() => useNavbar());
    act(() => {
      result.current.handleSearch({ key: 'Enter' } as any);
    });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('detects scroll when window scrollY > 50', () => {
    const { result } = renderHook(() => useNavbar());
    expect(result.current.isScrolled).toBe(false);
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));
    });
    expect(result.current.isScrolled).toBe(true);
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
  });
});
