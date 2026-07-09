import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Queries,
  RenderHookOptions,
  RenderHookResult,
  cleanup,
  queries,
  render,
  renderHook,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FC, PropsWithChildren } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const t = globalThis as unknown as Record<string, any>;

// Next Router Mocks
export const mockPush = t.__mockPush;
export const mockReplace = t.__mockReplace;
export const mockPrefetch = t.__mockPrefetch;
export const mockBack = t.__mockBack;

// Snackbar Mocks
export const mockShowSnackbar = t.__mockShowSnackbar;

// Auth Context Mocks
export const mockLogin = t.__mockLogin;
export const mockLogout = t.__mockLogout;
export const mockRegister = t.__mockRegister;
export const mockIsAdmin = t.__mockIsAdmin;
export const mockUseAuth = t.__mockUseAuth;

// Cart Context Mocks
export const mockAddToCart = t.__mockAddToCart;
export const mockUpdateQuantity = t.__mockUpdateQuantity;
export const mockRemoveFromCart = t.__mockRemoveFromCart;
export const mockClearCart = t.__mockClearCart;
export const mockGetCartTotal = t.__mockGetCartTotal;
export const mockGetCartItemCount = t.__mockGetCartItemCount;
export const mockUseCart = t.__mockUseCart;

// NextAuth Mocks
export const mockSignIn = t.__mockSignIn;
export const mockSignOut = t.__mockSignOut;
export const mockUseSession = t.__mockUseSession;

export const mockUseRouter = t.__mockUseRouter;

beforeEach(() => {
  cleanup();
  vi.clearAllMocks();

  // Set defaults
  mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  mockIsAdmin.mockReturnValue(false);
  mockGetCartTotal.mockReturnValue(0);
  mockGetCartItemCount.mockReturnValue(0);
  mockPrefetch.mockResolvedValue(undefined);

  mockUseRouter.mockReturnValue({
    push: mockPush,
    replace: mockReplace,
    prefetch: mockPrefetch,
    back: mockBack,
    pathname: '/',
    query: {},
    asPath: '/',
  });

  mockUseCart.mockReturnValue({
    cart: [],
    loading: false,
    addToCart: mockAddToCart,
    updateQuantity: mockUpdateQuantity,
    removeFromCart: mockRemoveFromCart,
    clearCart: mockClearCart,
    getCartTotal: mockGetCartTotal,
    getCartItemCount: mockGetCartItemCount,
    showSnackbar: mockShowSnackbar,
  });

  mockUseAuth.mockReturnValue({
    login: mockLogin,
    logout: mockLogout,
    register: mockRegister,
    isAdmin: mockIsAdmin,
    user: null,
    loading: false,
    error: null,
  });
});

const Providers: FC<PropsWithChildren> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  ui: Parameters<typeof render>[0],
  options: Parameters<typeof render>[1] = {}
): ReturnType<typeof render> =>
  render(ui, {
    wrapper: Providers,
    ...options,
  });

export function customRenderHook<
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container,
>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>
): RenderHookResult<Result, Props> {
  return renderHook(render, {
    wrapper: Providers,
    ...options,
  });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
export { customRenderHook as renderHook };
export { userEvent };
