import {
  act,
  mockLogin,
  mockRegister,
  render,
  renderHook,
  screen,
} from '@/src/utils/test';
import * as Formik from 'formik';
import * as NextAuthReact from 'next-auth/react';
import * as NextRouter from 'next/router';

import Register from './Register';
import * as RegisterHooks from './Register.hooks';
import useRegister from './Register.hooks';

describe('Register - Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
    mockLogin.mockResolvedValue(undefined);
  });

  it('should call register on form submission', async () => {
    vi.spyOn(NextRouter, 'useRouter').mockReturnValue({ push: vi.fn() } as any);

    let capturedOnSubmit: any;
    vi.spyOn(Formik, 'useFormik').mockImplementation((args: any) => {
      capturedOnSubmit = args.onSubmit;
      return {
        values: {},
        touched: {},
        errors: {},
        handleSubmit: vi.fn(),
        handleChange: vi.fn(),
        handleBlur: vi.fn(),
        isSubmitting: false,
      } as any;
    });

    renderHook(() => useRegister());

    await act(async () => {
      await capturedOnSubmit!(
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          password: 'Pass123!',
          confirmPassword: 'Pass123!',
          agreeTerms: true,
        },
        { setSubmitting: vi.fn() }
      );
    });

    expect(mockRegister).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'Pass123!',
    });
  });

  it('should call signIn on handleGoogleSignIn', async () => {
    const mockSignIn = vi.fn().mockResolvedValue(undefined);
    vi.spyOn(NextAuthReact, 'signIn').mockImplementation(mockSignIn as any);
    vi.spyOn(NextRouter, 'useRouter').mockReturnValue({ push: vi.fn() } as any);
    vi.spyOn(Formik, 'useFormik').mockReturnValue({} as any);

    const { result } = renderHook(() => useRegister());

    await act(async () => {
      await result.current.handleGoogleSignIn();
    });

    expect(mockSignIn).toHaveBeenCalledWith('google', {
      callbackUrl: '/',
    });
  });

  it('should toggle showPassword', () => {
    vi.spyOn(NextRouter, 'useRouter').mockReturnValue({ push: vi.fn() } as any);
    vi.spyOn(Formik, 'useFormik').mockReturnValue({} as any);

    const { result } = renderHook(() => useRegister());

    expect(result.current.showPassword).toBe(false);

    act(() => {
      result.current.handleClickShowPassword();
    });

    expect(result.current.showPassword).toBe(true);
  });
});

describe('Register - UI', () => {
  const buildMockReturn = (overrides: Record<string, unknown> = {}) => ({
    formik: {
      values: {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
      },
      touched: {} as Record<string, boolean>,
      errors: {} as Record<string, string>,
      handleSubmit: vi.fn(),
      handleChange: vi.fn(),
      handleBlur: vi.fn(),
      isSubmitting: false,
      ...((overrides.formik as Record<string, unknown>) || {}),
    },
    showPassword: false,
    handleClickShowPassword: vi.fn(),
    handleGoogleSignIn: vi.fn(),
    isLoading: false,
    isGoogleLoading: false,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.spyOn(RegisterHooks, 'default').mockReturnValue(
      buildMockReturn({ isLoading: true }) as any
    );

    render(<Register />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    vi.spyOn(RegisterHooks, 'default').mockReturnValue(
      buildMockReturn() as any
    );
    const { asFragment } = render(<Register />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should show Google loading state', () => {
    vi.spyOn(RegisterHooks, 'default').mockReturnValue(
      buildMockReturn({ isGoogleLoading: true }) as any
    );

    render(<Register />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
