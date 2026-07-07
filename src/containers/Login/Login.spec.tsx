import { render, screen } from '@testing-library/react';
import { act, renderHook } from '@testing-library/react';

import Login from './Login';

const mockSignIn = jest.fn();
const mockUseSession = jest.fn();
const mockRouterPush = jest.fn();
const mockShowSnackbar = jest.fn();
const mockLogin = jest.fn();

let capturedLoginOnSubmit:
  ((values: { email: string; password: string }) => Promise<void>) | undefined;

const mockFormik = {
  values: { email: '', password: '' },
  touched: {} as Record<string, boolean>,
  errors: {} as Record<string, string>,
  handleSubmit: jest.fn(),
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  isSubmitting: false,
};

const mockUseFormik = jest.fn(
  ({
    onSubmit,
  }: {
    onSubmit: (values: { email: string; password: string }) => Promise<void>;
  }) => {
    capturedLoginOnSubmit = onSubmit;
    return mockFormik;
  }
);

jest.mock('next-auth/react', () => ({
  signIn: (...args: unknown[]) =>
    (mockSignIn as (...args: unknown[]) => unknown)(...args),
  useSession: () => mockUseSession(),
}));

jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

jest.mock('formik', () => ({
  useFormik: (args: unknown) =>
    mockUseFormik(
      args as {
        onSubmit: (values: {
          email: string;
          password: string;
        }) => Promise<void>;
      }
    ),
}));

jest.mock('@/src/contexts/SnackBarContext', () => ({
  useSnackbar: () => ({ showSnackbar: mockShowSnackbar }),
}));

jest.mock('@/src/contexts/AuthContext', () => ({
  useAuth: () => ({ login: mockLogin }),
}));

jest.mock('@/lib/validation/loginSchema', () => ({
  loginInitialValues: { email: '', password: '' },
  loginSchema: { validate: jest.fn() },
}));

jest.mock('react-icons/fi', () => ({
  FiEye: () => <svg data-testid="FiEye" />,
  FiEyeOff: () => <svg data-testid="FiEyeOff" />,
}));

jest.mock('react-icons/tb', () => ({
  TbBrandGoogle: () => <svg data-testid="TbBrandGoogle" />,
}));

jest.mock('@mui/styles', () => ({
  makeStyles: () => () => ({}),
}));

jest.mock('next/link', () => {
  const MockLink = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;
  MockLink.displayName = 'MockLink';
  return MockLink;
});

const mockUseLoginReturn = jest.fn();
jest.mock('./Login.hooks', () => ({
  __esModule: true,
  default: (...args: unknown[]) => mockUseLoginReturn(...args),
}));

describe('Login - Hooks', () => {
  let useLogin: typeof import('./Login.hooks').default;

  beforeAll(() => {
    useLogin = jest.requireActual('./Login.hooks').default;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
    capturedLoginOnSubmit = undefined;
  });

  it('should call login and redirect on form submission', async () => {
    mockLogin.mockResolvedValue(undefined);

    renderHook(() => useLogin());

    await act(async () => {
      await capturedLoginOnSubmit!({
        email: 'test@example.com',
        password: 'secret123',
      });
    });

    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'secret123');
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  it('should call signIn on handleGoogleSignIn', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(mockSignIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/',
    });
  });

  it('should toggle showPassword', () => {
    const { result } = renderHook(() => useLogin());

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.handleClickShowPassword();
    });

    expect(result.current.showPassword).toBe(true);
  });
});

describe('Login - UI', () => {
  const buildMockReturn = (overrides: Record<string, unknown> = {}) => {
    const { formik: formikOverrides, ...restOverrides } = overrides;
    return {
      formik: {
        values: { email: '', password: '' },
        touched: {} as Record<string, boolean>,
        errors: {} as Record<string, string>,
        handleSubmit: jest.fn(),
        handleChange: jest.fn(),
        handleBlur: jest.fn(),
        isSubmitting: false,
        ...((formikOverrides as Record<string, unknown>) || {}),
      },
      showPassword: false,
      handleClickShowPassword: jest.fn(),
      handleGoogleSignIn: jest.fn(),
      isLoading: false,
      ...restOverrides,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseLoginReturn.mockReturnValue(buildMockReturn());
  });

  it('should render loading state', () => {
    mockUseLoginReturn.mockReturnValue(buildMockReturn({ isLoading: true }));

    render(<Login />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { asFragment } = render(<Login />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show "Signing in..." when formik.isSubmitting is true', () => {
    mockUseLoginReturn.mockReturnValue(
      buildMockReturn({
        formik: { isSubmitting: true },
      })
    );

    render(<Login />);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });
});
