import { loginInitialValues, loginSchema } from '@/lib/validation/loginSchema';
import { useAuth } from '@/src/contexts/AuthContext';
import { FormikProps, useFormik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const useLogin = (): UseLoginReturn => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/');
    }
  }, [session, status, router]);

  const formik = useFormik({
    initialValues: loginInitialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        await login(values.email, values.password);
        router.push('/');
      } catch {
        setStatus('Email or password is incorrect');
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
