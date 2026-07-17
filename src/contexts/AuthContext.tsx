import { RegisterData } from '@/types/index';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import {
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
  useSession,
} from 'next-auth/react';
import React, { useContext, useState } from 'react';

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  register: async () => {
    throw new Error('register function not implemented');
  },
  login: async () => {
    throw new Error('login function not implemented');
  },
  logout: async () => {
    throw new Error('logout function not implemented');
  },
  isAdmin: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const isAdmin = () => session?.user?.role === 'ADMIN';

  const registerUser = async (userData: RegisterData) => {
    try {
      const response = await axios.post('/api/auth/register', userData, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setError('Error: ' + (err.response?.data?.message || err.message));
        throw err;
      }
    }
  };

  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: registerUser,
    onError: (error: Error) => {
      setError('Error: ' + error.message);
    },
  });

  const register = async (userData: RegisterData) => {
    setError(null);
    try {
      await registerMutation(userData);
    } catch (err) {
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    setError(null);
    const result = await nextAuthSignIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      const errorMessage = 'Email or password is incorrect';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await nextAuthSignOut({ redirect: false });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const fallback = 'An unknown error occurred';
        setError(fallback);
        throw new Error(fallback);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading: status === 'loading',
        error,
        register,
        login,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export interface AuthContextType {
  user: AuthUser | null | undefined;
  loading: boolean;
  error: string | null;
  register: (userData: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
}

export interface AuthUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  role?: string;
  cartId?: string;
}
