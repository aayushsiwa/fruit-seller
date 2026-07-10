import { act, render, renderHook, screen, waitFor } from '@/src/utils/test';
import axios from 'axios';

import ForgotPassword from './ForgotPassword';
import * as ForgotPasswordHooks from './ForgotPassword.hooks';

vi.mock('axios');

describe('ForgotPassword - Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(axios.isAxiosError).mockImplementation(
      (payload: any) => !!payload?.isAxiosError
    );
  });

  it('should request reset link successfully', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        success: true,
        message: 'Reset link generated successfully.',
        resetLink: '/reset-password?token=some-token',
      },
    });

    const { result } = renderHook(() =>
      ForgotPasswordHooks.useForgotPassword()
    );

    await act(async () => {
      await result.current.formik.setValues({
        email: 'user@example.com',
      });
    });

    await act(async () => {
      await result.current.formik.submitForm();
    });

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/auth/forgot-password', {
        email: 'user@example.com',
      });
      expect(result.current.successMessage).toBe(
        'Reset link generated successfully.'
      );
      expect(result.current.demoResetLink).toBe(
        '/reset-password?token=some-token'
      );
    });
  });

  it('should not set demo link when email is successfully sent', async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        success: true,
        emailSent: true,
        message: 'A password reset link has been sent to your email.',
        resetLink: '/reset-password?token=some-token',
      },
    });

    const { result } = renderHook(() =>
      ForgotPasswordHooks.useForgotPassword()
    );

    await act(async () => {
      await result.current.formik.setValues({
        email: 'user@example.com',
      });
    });

    await act(async () => {
      await result.current.formik.submitForm();
    });

    await waitFor(() => {
      expect(result.current.successMessage).toBe(
        'A password reset link has been sent to your email.'
      );
      expect(result.current.demoResetLink).toBeNull();
    });
  });

  it('should handle error during reset link request', async () => {
    vi.mocked(axios.post).mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: {
          message: 'No user found with this email address',
        },
      },
    });

    const { result } = renderHook(() =>
      ForgotPasswordHooks.useForgotPassword()
    );

    await act(async () => {
      await result.current.formik.setValues({
        email: 'nonexistent@example.com',
      });
    });

    await act(async () => {
      await result.current.formik.submitForm();
    });

    await waitFor(() => {
      expect(result.current.errorMessage).toBe(
        'No user found with this email address'
      );
      expect(result.current.successMessage).toBeNull();
    });
  });
});

describe('ForgotPassword - UI', () => {
  const buildMockReturn = (overrides: Record<string, any> = {}) => {
    const { formik: formikOverrides, ...restOverrides } = overrides;
    return {
      formik: {
        values: { email: '' },
        touched: {} as Record<string, boolean>,
        errors: {} as Record<string, string>,
        handleSubmit: vi.fn(),
        handleChange: vi.fn(),
        handleBlur: vi.fn(),
        isSubmitting: false,
        ...((formikOverrides as Record<string, any>) || {}),
      },
      successMessage: null,
      errorMessage: null,
      demoResetLink: null,
      cooldown: 0,
      isResending: false,
      handleResendEmail: vi.fn(),
      isConfirmed: false,
      ...restOverrides,
    } as any;
  };

  it('should match snapshot in initial state', () => {
    vi.spyOn(ForgotPasswordHooks, 'useForgotPassword').mockReturnValue(
      buildMockReturn()
    );
    const { asFragment } = render(<ForgotPassword />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should match snapshot when successMessage and demoResetLink are set', () => {
    vi.spyOn(ForgotPasswordHooks, 'useForgotPassword').mockReturnValue(
      buildMockReturn({
        successMessage: 'Success! Link generated.',
        demoResetLink: '/reset-password?token=xyz',
      })
    );
    const { asFragment } = render(<ForgotPassword />);
    expect(asFragment()).toMatchSnapshot();
    expect(
      screen.getByText('[Demo Mode] Reset link generated successfully:')
    ).toBeInTheDocument();
  });

  it('should render disabled resend button during cooldown', () => {
    vi.spyOn(ForgotPasswordHooks, 'useForgotPassword').mockReturnValue(
      buildMockReturn({
        successMessage: 'Link sent!',
        cooldown: 45,
        isConfirmed: true,
      })
    );
    render(<ForgotPassword />);
    const resendBtn = screen.getByRole('button', {
      name: 'Resend Email in 45s',
    });
    expect(resendBtn).toBeInTheDocument();
    expect(resendBtn).toBeDisabled();
  });

  it('should render active resend button when cooldown expires', async () => {
    const handleResendMock = vi.fn();
    vi.spyOn(ForgotPasswordHooks, 'useForgotPassword').mockReturnValue(
      buildMockReturn({
        successMessage: 'Link sent!',
        cooldown: 0,
        handleResendEmail: handleResendMock,
        isConfirmed: true,
      })
    );
    render(<ForgotPassword />);
    const resendBtn = screen.getByRole('button', { name: 'Resend Email' });
    expect(resendBtn).toBeInTheDocument();
    expect(resendBtn).not.toBeDisabled();

    await act(async () => {
      resendBtn.click();
    });
    expect(handleResendMock).toHaveBeenCalled();
  });

  it('should not render form and keep showing confirmation screen when isConfirmed is true', () => {
    vi.spyOn(ForgotPasswordHooks, 'useForgotPassword').mockReturnValue(
      buildMockReturn({
        successMessage: 'A password reset link has been sent to your email.',
        isConfirmed: true,
      })
    );
    render(<ForgotPassword />);
    expect(screen.queryByLabelText('Email Address')).not.toBeInTheDocument();
    expect(
      screen.getByText('A password reset link has been sent to your email.')
    ).toBeInTheDocument();
  });
});
