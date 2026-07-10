import {
  act,
  mockPush,
  mockShowSnackbar,
  mockUseRouter,
  render,
  renderHook,
  screen,
  waitFor,
} from '@/src/utils/test';
import axios from 'axios';

import ResetPassword from './ResetPassword';
import * as ResetPasswordHooks from './ResetPassword.hooks';

vi.mock('axios');

describe('ResetPassword - Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.isAxiosError).mockImplementation(
      (payload: any) => !!payload?.isAxiosError
    );
  });

  it('should validate token and submit successfully', async () => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn().mockResolvedValue(undefined),
      back: vi.fn(),
      pathname: '/reset-password',
      query: { token: 'valid-token' },
      asPath: '/reset-password?token=valid-token',
      isReady: true,
    } as any);

    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Password reset successfully.',
      },
    });

    const { result } = renderHook(() => ResetPasswordHooks.useResetPassword());

    expect(result.current.isTokenValid).toBe(true);

    await act(async () => {
      await result.current.formik.setValues({
        password: 'new-secure-password',
        confirmPassword: 'new-secure-password',
      });
    });

    await act(async () => {
      await result.current.formik.submitForm();
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/auth/reset-password', {
        token: 'valid-token',
        password: 'new-secure-password',
      });
      expect(mockShowSnackbar).toHaveBeenCalledWith(
        'Your password has been successfully reset. Please log in.',
        'success'
      );
      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  it('should handle token validation when missing or invalid', async () => {
    mockUseRouter.mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      prefetch: vi.fn().mockResolvedValue(undefined),
      back: vi.fn(),
      pathname: '/reset-password',
      query: {},
      asPath: '/reset-password',
      isReady: true,
    } as any);

    const { result } = renderHook(() => ResetPasswordHooks.useResetPassword());

    expect(result.current.isTokenValid).toBe(false);
    expect(result.current.errorMessage).toBe(
      'Invalid or missing password reset token.'
    );
  });
});

describe('ResetPassword - UI', () => {
  const buildMockReturn = (overrides: Record<string, any> = {}) => {
    const { formik: formikOverrides, ...restOverrides } = overrides;
    return {
      formik: {
        values: { password: '', confirmPassword: '' },
        touched: {} as Record<string, boolean>,
        errors: {} as Record<string, string>,
        handleSubmit: vi.fn(),
        handleChange: vi.fn(),
        handleBlur: vi.fn(),
        isSubmitting: false,
        ...((formikOverrides as Record<string, any>) || {}),
      },
      showPassword: false,
      showConfirmPassword: false,
      handleClickShowPassword: vi.fn(),
      handleClickShowConfirmPassword: vi.fn(),
      errorMessage: null,
      isTokenValid: true,
      ...restOverrides,
    } as any;
  };

  it('should match snapshot when token is valid', () => {
    vi.spyOn(ResetPasswordHooks, 'useResetPassword').mockReturnValue(
      buildMockReturn()
    );
    const { asFragment } = render(<ResetPassword />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot when token is invalid', () => {
    vi.spyOn(ResetPasswordHooks, 'useResetPassword').mockReturnValue(
      buildMockReturn({
        isTokenValid: false,
        errorMessage: 'Invalid or missing password reset token.',
      })
    );
    const { asFragment } = render(<ResetPassword />);
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Request New Reset Link')).toBeInTheDocument();
  });
});
