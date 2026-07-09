import { loginInitialValues, loginSchema } from '@/lib/validation/loginSchema';
import { useAuth } from '@/src/contexts/AuthContext';
import { useSnackbar } from '@/src/contexts/SnackBarContext';
import { FormikProps, useFormik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const { showSnackbar } = useSnackbar();
  const { login } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        await login(values.email, values.password);
        router.push('/');
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred';
        showSnackbar(errorMessage, 'error');
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/' });
  };

  return {
    formik,
    showPassword,
    handleClickShowPassword,
    handleGoogleSignIn,
    isLoading: status === 'loading',
  };
};

export default useLogin;

export type UseLoginReturn = {
  formik: FormikProps<typeof loginInitialValues>;
  showPassword: boolean;
  handleClickShowPassword: () => void;
  handleGoogleSignIn: () => Promise<void>;
  isLoading: boolean;
};
