import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/src/contexts/SnackBarContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { RegisterData } from "@/types";
import { useFormik } from "formik";
import {
    registerInitialValues,
    registerSchema,
} from "@/lib/validation/registerSchema";
import { signIn } from "next-auth/react";

const useRegister = () => {
    const router = useRouter();
    const { showSnackbar } = useSnackbar();
    const { register, login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterData) => {
            try {
                await register(data);
            } catch {
                throw new Error("Registration failed");
            }

            try {
                await login(data.email, data.password);
            } catch (err: unknown) {
                let message =
                    "Registration succeeded, but login failed. Please sign in manually.";
                if (err instanceof Error) {
                    message += ` ${err.message}`;
                }
                throw new Error(message);
            }
        },

        retry: 2,
        retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 3000),
        onSuccess: () => {
            showSnackbar("Registration successful!", "success");
            router.push("/");
        },
        onError: (error: Error) => {
            showSnackbar(error.message, "error");
        },
    });

    const formik = useFormik({
        initialValues: registerInitialValues,
        validationSchema: registerSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                await register({
                    firstName: values.firstName,
                    lastName: values.lastName,
                    email: values.email,
                    password: values.password,
                });
            } catch {
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleClickShowPassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    const handleGoogleSignIn = useCallback(async () => {
        try {
            setIsGoogleLoading(true);
            await signIn("google", { callbackUrl: "/" });
        } catch {
            showSnackbar("Google Sign-In failed", "error");
        } finally {
            setIsGoogleLoading(false);
        }
    }, [showSnackbar]);

    return {
        register: registerMutation.mutateAsync,
        isLoading: registerMutation.isPending,
        isGoogleLoading,
        showPassword,
        handleClickShowPassword,
        handleGoogleSignIn,
        formik,
        registerMutation,
    };
};


export default useRegister;