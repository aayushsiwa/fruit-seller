import {
  act,
  mockLogin,
  mockPush,
  mockSignIn,
  mockUseSession,
  render,
  renderHook,
  screen,
  waitFor,
} from '@/src/utils/test';

import Login from './Login';
import * as LoginHooks from './Login.hooks';

describe('Login - Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSession.mockReturnValue({ data: null, status: 'unauthenticated' });
  });

  it('should call login and redirect on form submission', async () => {
    mockLogin.mockResolvedValue(undefined);

    const { result } = renderHook(() => LoginHooks.default());

    await act(async () => {
      await result.current.formik.setValues({
        email: 'test@example.com',
        password: 'secret123',
      });
    });

    await act(async () => {
      await result.current.formik.submitForm();
    });
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'secret123');
      expect(mockPush).toHaveBeenCalledWith('/');
    });
  });

  it('should call signIn on handleGoogleSignIn', async () => {
    mockSignIn.mockResolvedValue(undefined);

    const { result } = renderHook(() => LoginHooks.default());

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(mockSignIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/',
    });
  });

  it('should toggle showPassword', () => {
    const { result } = renderHook(() => LoginHooks.default());

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
        handleSubmit: vi.fn(),
        handleChange: vi.fn(),
        handleBlur: vi.fn(),
        isSubmitting: false,
        ...((formikOverrides as Record<string, unknown>) || {}),
      },
      showPassword: false,
      handleClickShowPassword: vi.fn(),
      handleGoogleSignIn: vi.fn(),
      isLoading: false,
      ...restOverrides,
    } as any;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.spyOn(LoginHooks, 'default').mockReturnValue(
      buildMockReturn({ isLoading: true })
    );

    render(<Login />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    vi.spyOn(LoginHooks, 'default').mockReturnValue(buildMockReturn());
    const { asFragment } = render(<Login />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show "Signing in..." when formik.isSubmitting is true', () => {
    vi.spyOn(LoginHooks, 'default').mockReturnValue(
      buildMockReturn({
        formik: { isSubmitting: true },
      })
    );

    render(<Login />);
    expect(screen.getByText('Signing in...')).toBeInTheDocument();
  });
});
