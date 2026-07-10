import { forgotPasswordAPI } from '@/lib/api/auth/forgotPassword';
import {
  forgotPasswordInitialValues,
  forgotPasswordSchema,
} from '@/lib/validation/forgotPasswordSchema';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useForgotPassword = (): UseForgotPasswordReturn => {
  const router = useRouter();
  const { query } = router;
  const queryEmail = Array.isArray(query.email)
    ? query.email[0]
    : (query.email ?? '');

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoResetLink, setDemoResetLink] = useState<string | null>(null);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (isConfirmed && Object.keys(query).length > 0) {
      router.replace('/forgot-password', undefined, { shallow: true });
    }
  }, [isConfirmed, query, router]);

  const formik = useFormik({
    initialValues: {
      ...forgotPasswordInitialValues,
      email: queryEmail || forgotPasswordInitialValues.email,
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSuccessMessage(null);
      setErrorMessage(null);
      setDemoResetLink(null);

      try {
        const response = await forgotPasswordAPI({
          email: values.email,
        });

        if (response.data.success) {
          setSubmittedEmail(values.email);
          setSuccessMessage(
            response.data.message ||
              'If that email exists, we have generated a reset link.'
          );
          if (!response.data.emailSent && response.data.resetLink) {
            setDemoResetLink(response.data.resetLink);
          }
          setCooldown(60);
          setIsConfirmed(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setErrorMessage(
            error.response?.data?.message ||
              'Something went wrong. Please try again.'
          );
        } else {
          setErrorMessage('Something went wrong. Please try again.');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleResendEmail = async () => {
    if (cooldown > 0 || !submittedEmail || isResending) return;
    setSuccessMessage(null);
    setErrorMessage(null);
    setDemoResetLink(null);
    setIsResending(true);

    try {
      const response = await forgotPasswordAPI({
        email: submittedEmail,
      });

      if (response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'If that email exists, we have generated a reset link.'
        );
        if (!response.data.emailSent && response.data.resetLink) {
          setDemoResetLink(response.data.resetLink);
        }
        setCooldown(60);
        setIsConfirmed(true);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            'Something went wrong. Please try again.'
        );
      } else {
        setErrorMessage('Something went wrong. Please try again.');
      }
    } finally {
      setIsResending(false);
    }
  };

  return {
    formik,
    successMessage,
    errorMessage,
    demoResetLink,
    cooldown,
    isResending,
    handleResendEmail,
    isConfirmed,
  };
};

export type UseForgotPasswordReturn = {
  formik: ReturnType<typeof useFormik<{ email: string }>>;
  successMessage: string | null;
  errorMessage: string | null;
  demoResetLink: string | null;
  cooldown: number;
  isResending: boolean;
  handleResendEmail: () => Promise<void>;
  isConfirmed: boolean;
};
