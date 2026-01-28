import { useState, useEffect, useCallback, createContext, useContext } from 'react';
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  avatar_url?: string;
  role: string;
  permissions: string[];
  preferences?: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
  };
}
export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean;
}
export interface ForgotPasswordData {
  email: string;
}
export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string;
}
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!user;
  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check authentication');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Login
  const login = useCallback(async (data: LoginData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      const userData = await response.json();
      setUser(userData.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Register
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      const userData = await response.json();
      setUser(userData.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Forgot password
  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Reset password
  const resetPassword = useCallback(async (data: ResetPasswordData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Verify email
  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Email verification failed');
      }
      // Refresh user data after verification
      await refreshUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Resend verification email
  const resendVerification = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/v1/auth/resend-verification', {
        method: 'POST',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to resend verification email');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const response = await fetch('/api/v1/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user data');
      setUser(null);
    }
  }, []);
  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    refreshUser,
  };
};
// Auth Context
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
export default useAuth;
