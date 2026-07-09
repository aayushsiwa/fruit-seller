import { MockAddresses } from '@/entity/Addresses/Addresses.mock';
import { MockCartItems } from '@/entity/Payments/Payments.mock';
import { MockProducts } from '@/entity/Products/Products.mock';
import * as GetAddressesAPI from '@/lib/api/addresses/getAddresses';
import * as SaveAddressAPI from '@/lib/api/addresses/saveAddress';
import * as CreateOrderAPI from '@/lib/api/orders/createOrder';
import * as InitPaymentAPI from '@/lib/api/payments/initPayment';
import * as GetPincodeAPI from '@/lib/api/pincodes/getPincode';
import * as GetProductAPI from '@/lib/api/products/getProduct';
import {
  act,
  mockPush,
  mockUseCart,
  mockUseRouter,
  mockUseSession,
  render,
  renderHook,
  screen,
  waitFor,
} from '@/src/utils/test';
import { CartItem } from '@/types/index';
import * as MaterialUI from '@mui/material';

import Checkout from './Checkout';
import { useCheckout } from './Checkout.hooks';

const defaultCartCtx = {
  cart: [] as CartItem[],
  getCartTotal: vi.fn(() => 0),
  clearCart: vi.fn(),
  showSnackbar: vi.fn(),
  loading: false,
};

interface WindowWithRazorpay {
  Razorpay?: any;
}

beforeEach(() => {
  (window as unknown as WindowWithRazorpay).Razorpay = vi.fn();
});

afterEach(() => {
  delete (window as unknown as WindowWithRazorpay).Razorpay;
});

function setupDefaultMocks() {
  (mockUseRouter as any).mockReturnValue({
    push: mockPush,
    prefetch: vi.fn(),
  } as any);
  (mockUseSession as any).mockReturnValue({
    data: null,
    status: 'unauthenticated',
  });
  (mockUseCart as any).mockReturnValue(defaultCartCtx as any);

  vi.spyOn(GetAddressesAPI, 'useGetAddresses').mockReturnValue({
    data: undefined,
  } as any);
  vi.spyOn(GetPincodeAPI, 'useGetPincode').mockReturnValue({
    data: undefined,
  } as any);
  vi.spyOn(SaveAddressAPI, 'useSaveAddress').mockReturnValue({
    mutateAsync: vi.fn(),
  } as any);
  vi.spyOn(InitPaymentAPI, 'useInitPayment').mockReturnValue({
    mutateAsync: vi.fn(),
  } as any);
  vi.spyOn(CreateOrderAPI, 'useCreateOrder').mockReturnValue({
    mutateAsync: vi.fn(),
  } as any);
  vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
  vi.clearAllMocks();
  mockPush.mockClear();
}

describe('Checkout - Hooks', () => {
  beforeEach(setupDefaultMocks);

  it('should return default state', async () => {
    const { result } = renderHook(() => useCheckout());

    await waitFor(() => {
      expect(result.current.status).toBe('unauthenticated');
    });

    expect(result.current.cart).toEqual([]);
    expect(result.current.products).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isLoadingProducts).toBe(false);
    expect(result.current.hasError).toBe(false);
    expect(result.current.processing).toBe(false);
  });

  it('should redirect to login when unauthenticated', async () => {
    render(<Checkout />);
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should load saved addresses when authenticated', async () => {
    (mockUseSession as any).mockReturnValue({
      data: { user: { email: 'test@test.com' } } as any,
      status: 'authenticated',
    });

    vi.spyOn(GetAddressesAPI, 'useGetAddresses').mockReturnValue({
      data: { data: MockAddresses },
    } as any);

    const { result } = renderHook(() => useCheckout());

    await waitFor(() => {
      expect(result.current.savedAddresses).toEqual(MockAddresses);
      expect(result.current.selectedAddressId).toBe('addr-1');
    });
  });

  it('should auto-fill city and state when a single office is returned', async () => {
    (mockUseSession as any).mockReturnValue({
      data: { user: { email: 'test@test.com' } } as any,
      status: 'authenticated',
    });

    const stableData = {
      offices: [
        {
          officeName: 'Connaught Place HO',
          district: 'New Delhi',
          state: 'Delhi',
          block: 'Connaught Place',
          delivery: true,
        },
      ],
    };
    vi.spyOn(GetPincodeAPI, 'useGetPincode').mockImplementation(
      (pin, enabled) => {
        if (enabled) {
          return { data: { data: stableData } } as any;
        }
        return { data: undefined } as any;
      }
    );

    const { result } = renderHook(() => useCheckout());

    act(() => {
      result.current.setNewAddress((prev) => ({
        ...prev,
        postal_code: '110001',
      }));
    });

    await waitFor(() => {
      expect(result.current.newAddress.city).toBe('New Delhi');
      expect(result.current.newAddress.state).toBe('Delhi');
      expect(result.current.offices).toEqual(stableData.offices);
      expect(result.current.selectedOffice).toEqual(stableData.offices[0]);
    });
  });

  it('should not auto-fill when multiple offices are returned', async () => {
    (mockUseSession as any).mockReturnValue({
      data: { user: { email: 'test@test.com' } } as any,
      status: 'authenticated',
    });

    const stableData = {
      offices: [
        {
          officeName: 'Mumbai GPO',
          district: 'Mumbai',
          state: 'Maharashtra',
          block: 'Fort',
          delivery: true,
        },
        {
          officeName: 'Elephanta Caves PO',
          district: 'Raigarh',
          state: 'Maharashtra',
          block: 'Raigarh',
          delivery: true,
        },
      ],
    };
    vi.spyOn(GetPincodeAPI, 'useGetPincode').mockImplementation(
      (pin, enabled) => {
        if (enabled) {
          return { data: { data: stableData } } as any;
        }
        return { data: undefined } as any;
      }
    );

    const { result } = renderHook(() => useCheckout());

    act(() => {
      result.current.setNewAddress((prev) => ({
        ...prev,
        postal_code: '400001',
      }));
    });

    await waitFor(() => {
      expect(result.current.offices).toEqual(stableData.offices);
      expect(result.current.selectedOffice).toBeNull();
      expect(result.current.newAddress.city).toBe('Mumbai');
    });
  });
});

describe('Checkout - UI', () => {
  const mockProducts = MockProducts;
  const mockCart = MockCartItems;

  beforeEach(setupDefaultMocks);

  describe('when rendered in web view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(false);
    });

    it('should render loading state', async () => {
      (mockUseSession as any).mockReturnValue({
        data: null,
        status: 'loading',
      });

      let container: any;
      await act(async () => {
        const res = render(<Checkout />);
        container = res.container;
      });
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with products loaded', async () => {
      (mockUseSession as any).mockReturnValue({
        data: { user: { email: 'test@test.com' } } as any,
        status: 'authenticated',
      });
      (mockUseCart as any).mockReturnValue({
        ...defaultCartCtx,
        cart: mockCart,
      } as any);
      vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
        (id: string) => {
          const product = mockProducts.find((p) => p.id === id);
          return Promise.resolve({ data: { product } } as any);
        }
      );

      let container: any;
      await act(async () => {
        const res = render(<Checkout />);
        container = res.container;
      });
      await waitFor(() => {
        expect(screen.getByText('Grapes')).toBeInTheDocument();
      });
      expect(container).toMatchSnapshot();
    });
  });

  describe('when rendered in mobile view', () => {
    beforeEach(() => {
      vi.spyOn(MaterialUI, 'useMediaQuery').mockReturnValue(true);
    });

    it('should render loading state', async () => {
      (mockUseSession as any).mockReturnValue({
        data: null,
        status: 'loading',
      });

      let container: any;
      await act(async () => {
        const res = render(<Checkout />);
        container = res.container;
      });
      expect(container).toMatchSnapshot();
    });

    it('should match snapshot with products loaded', async () => {
      (mockUseSession as any).mockReturnValue({
        data: { user: { email: 'test@test.com' } } as any,
        status: 'authenticated',
      });
      (mockUseCart as any).mockReturnValue({
        ...defaultCartCtx,
        cart: mockCart,
      } as any);
      vi.spyOn(GetProductAPI, 'getProductAPI').mockImplementation(
        (id: string) => {
          const product = mockProducts.find((p) => p.id === id);
          return Promise.resolve({ data: { product } } as any);
        }
      );

      let container: any;
      await act(async () => {
        const res = render(<Checkout />);
        container = res.container;
      });
      await waitFor(() => {
        expect(screen.getByText('Grapes')).toBeInTheDocument();
      });
      expect(container).toMatchSnapshot();
    });
  });
});
