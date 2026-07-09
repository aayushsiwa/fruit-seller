import '@testing-library/jest-dom';

/* eslint-disable @typescript-eslint/no-require-imports */
const React = require('react');
/* eslint-enable @typescript-eslint/no-require-imports */

vi.mock('@mui/material', { spy: true });

const { motionProxy, AnimatePresence } = vi.hoisted(() => {
  const noopComponent = (tag: string) =>
    React.forwardRef(function NoopMotionComponent(
      { children, ...htmlProps }: any,
      ref: any
    ) {
      return React.createElement(tag, { ...htmlProps, ref }, children);
    });
  const customMotion = (target: React.ComponentType<any>) =>
    React.forwardRef(function CustomMotionComponent(props: any, ref: any) {
      return React.createElement(target, { ...props, ref });
    });
  return {
    motionProxy: new Proxy(customMotion as any, {
      get: (_, tag: string) => noopComponent(tag),
    }),
    AnimatePresence: ({ children }: any) => children,
  };
});

vi.mock('framer-motion', () => ({
  motion: motionProxy,
  AnimatePresence,
}));

vi.hoisted(() => {
  const t = globalThis as any;

  t.__mockShowSnackbar = vi.fn();
  t.__mockLogin = vi.fn();
  t.__mockLogout = vi.fn();
  t.__mockRegister = vi.fn();
  t.__mockIsAdmin = vi.fn(() => false);
  t.__mockAddToCart = vi.fn();
  t.__mockUpdateQuantity = vi.fn();
  t.__mockRemoveFromCart = vi.fn();
  t.__mockClearCart = vi.fn();
  t.__mockGetCartTotal = vi.fn(() => 0);
  t.__mockGetCartItemCount = vi.fn(() => 0);
  t.__mockPush = vi.fn();
  t.__mockReplace = vi.fn();
  t.__mockPrefetch = vi.fn().mockResolvedValue(undefined);
  t.__mockBack = vi.fn();
  t.__mockSignIn = vi.fn();
  t.__mockSignOut = vi.fn();

  t.__mockUseRouter = vi.fn(() => ({
    push: t.__mockPush,
    replace: t.__mockReplace,
    prefetch: t.__mockPrefetch,
    back: t.__mockBack,
    pathname: '/',
    query: {},
    asPath: '/',
  }));

  t.__mockUseSession = vi.fn(() => ({
    data: null,
    status: 'unauthenticated',
  }));

  t.__mockUseAuth = vi.fn(() => ({
    login: t.__mockLogin,
    logout: t.__mockLogout,
    register: t.__mockRegister,
    isAdmin: t.__mockIsAdmin,
    user: null,
    loading: false,
    error: null,
  }));

  t.__mockUseCart = vi.fn(() => ({
    cart: [],
    loading: false,
    addToCart: t.__mockAddToCart,
    updateQuantity: t.__mockUpdateQuantity,
    removeFromCart: t.__mockRemoveFromCart,
    clearCart: t.__mockClearCart,
    getCartTotal: t.__mockGetCartTotal,
    getCartItemCount: t.__mockGetCartItemCount,
    showSnackbar: t.__mockShowSnackbar,
  }));
});

vi.mock('next/router', () => ({
  useRouter: () => (globalThis as any).__mockUseRouter(),
}));

vi.mock('@/src/contexts/SnackBarContext', () => ({
  useSnackbar: () => ({
    showSnackbar: (globalThis as any).__mockShowSnackbar,
  }),
  SnackbarProvider: ({ children }: any) => children,
}));

vi.mock('@/src/contexts/AuthContext', () => ({
  useAuth: () => (globalThis as any).__mockUseAuth(),
}));

vi.mock('@/src/contexts/CartContext', () => ({
  useCart: () => (globalThis as any).__mockUseCart(),
}));

vi.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) => (globalThis as any).__mockSignIn(...args),
  signOut: (...args: unknown[]) => (globalThis as any).__mockSignOut(...args),
  useSession: () => (globalThis as any).__mockUseSession(),
  SessionProvider: ({ children }: any) => children,
}));

class IntersectionObserverMock {
  constructor() {}
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);
