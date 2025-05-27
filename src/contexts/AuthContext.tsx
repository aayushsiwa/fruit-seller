import React, { useContext, useState } from "react";
import {
  useSession,
  signIn as nextAuthSignIn,
  signOut as nextAuthSignOut,
} from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { RegisterData, AuthContextType } from "@/types";
import axios from "axios";

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  register: async () => {
    throw new Error("register function not implemented");
  },
  login: async () => {
    throw new Error("login function not implemented");
  },
  logout: async () => {
    throw new Error("logout function not implemented");
  },
  isAdmin: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const isAdmin = () => session?.user?.role === "admin";

  const registerUser = async (userData: RegisterData) => {
    try {
      const response = await axios.post("/api/auth/register", userData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (err) {
      if (err instanceof axios.AxiosError) {
        setError("Error: " + (err.response?.data?.message || err.message));
        throw err;
      }
    }
  };

  const { mutateAsync: registerMutation } = useMutation({
    mutationFn: registerUser,
    onError: (error: Error) => {
      setError("Error: " + error.message);
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
    try {
      const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const errorMessage =
          result.error.toLowerCase() === "invalid credentials"
            ? "Invalid credentials"
            : result.error;
        setError(errorMessage);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const fallback = "An unknown error occurred";
        setError(fallback);
      }
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
        const fallback = "An unknown error occurred";
        setError(fallback);
        throw new Error(fallback);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: session?.user || null,
        loading: status === "loading",
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
