import { resetPasswordAPI } from '@/lib/api/auth/resetPassword';
import {
  resetPasswordInitialValues,
  resetPasswordSchema,
} from '@/lib/validation/resetPasswordSchema';
import { useSnackbar } from '@/src/contexts/SnackBarContext';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useResetPassword = (): UseResetPasswordReturn => {
  const router = useRouter();
  const { token } = router.query;
  const { showSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (router.isReady) {
      if (!token || typeof token !== 'string') {
        setIsTokenValid(false);
        setErrorMessage('Invalid or missing password reset token.');
      } else {
        setIsTokenValid(true);
      }
    }
  }, [router.isReady, token]);

  const formik = useFormik({
    initialValues: resetPasswordInitialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setErrorMessage(null);

      try {
        const response = await resetPasswordAPI({
          token: typeof token === 'string' ? token : '',
          password: values.password,
        });

        if (response.data.success) {
          showSnackbar(
            'Your password has been successfully reset. Please log in.',
            'success'
          );
          router.push('/login');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message ||
              'Failed to reset password. Please request a new link.'
          );
        } else {
          setErrorMessage(
            'Failed to reset password. Please request a new link.'
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  return {
    formik,
    showPassword,
    showConfirmPassword,
    handleClickShowPassword,
    handleClickShowConfirmPassword,
    errorMessage,
    isTokenValid,
  };
};

export type UseResetPasswordReturn = {
  formik: ReturnType<
    typeof useFormik<{ password: string; confirmPassword: string }>
  >;
  showPassword: boolean;
  showConfirmPassword: boolean;
  handleClickShowPassword: () => void;
  handleClickShowConfirmPassword: () => void;
  errorMessage: string | null;
  isTokenValid: boolean | null;
};
