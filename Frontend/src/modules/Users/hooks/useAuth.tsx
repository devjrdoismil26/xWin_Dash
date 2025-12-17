import React from 'react';
/**
 * Hook useAuth (Alternativo) - DEPRECATED
 *
 * @description
 * ?? **DEPRECATED:** Este hook ? uma vers?o alternativa que n?o ? mais recomendada.
 * Use `useAuth` de `@/contexts/AuthContext` como padr?o.
 *
 * Este hook oferece autentica??o usando fetch direto ao inv?s de apiClient.
 * Mantido para compatibilidade, mas deve ser migrado para AuthContext.
 *
 * @module modules/Users/hooks/useAuth
 * @deprecated Use `useAuth` de `@/contexts/AuthContext` ao inv?s deste hook
 * @since 1.0.0
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { apiClient } from '@/services';

/**
 * Interface do Usu?rio (Alternativa)
 *
 * @interface User
 * @property {number} id - ID do usu?rio
 * @property {string} name - Nome do usu?rio
 * @property {string} email - Email do usu?rio
 * @property {string} [email_verified_at] - Data de verifica??o de email (opcional)
 * @property {string} [avatar_url] - URL do avatar (opcional)
 * @property {string} role - Role do usu?rio
 * @property {string[]} permissions - Lista de permiss?es
 * @property {Object} [preferences] - Prefer?ncias do usu?rio (opcional)
 * @property {'light' | 'dark' | 'auto'} [preferences.theme] - Tema preferido
 * @property {string} [preferences.language] - Idioma preferido
 * @property {string} [preferences.timezone] - Timezone preferido
 */
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
  timezone: string; };

}
export interface LoginData {
  email: string;
  password: string;
  remember?: boolean; }
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  terms_accepted: boolean; }
export interface ForgotPasswordData {
  email: string; }
export interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
  password_confirmation: string; }
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
  refreshUser: () => Promise<void>; }
/**
 * Hook useAuth (Alternativo) - DEPRECATED
 *
 * @description
 * ?? **DEPRECATED:** Este hook ? uma vers?o alternativa que n?o ? mais recomendada.
 * Use `useAuth` de `@/contexts/AuthContext` ao inv?s deste.
 *
 * Este hook gerencia autentica??o usando fetch direto, sem apiClient.
 * Mantido apenas para compatibilidade com c?digo legado.
 *
 * @returns {AuthContextType} Objeto com estado e fun??es de autentica??o
 * @deprecated Use `useAuth` de `@/contexts/AuthContext`
 *
 * @example
 * ```tsx
 * // ? N?O USE (deprecated)
 * import useAuth from '@/modules/Users/hooks/useAuth';
 *
 * // ? USE ISSO (recomendado)
 * import { useAuth } from '@/contexts/AuthContext';
 * ```
 */
export const useAuth = (): AuthContextType => {
  const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user;

  /**
   * Verifica autentica??o ao montar componente
   */
  useEffect(() => {
    checkAuth();

  }, []);

  /**
   * Verifica se o usu?rio est? autenticado
   *
   * @description
   * Faz requisi??o para /api/v1/auth/me para verificar autentica??o.
   */
  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response;
        setUser(userData);

      } else {
        setUser(null);

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check authentication');

      setUser(null);

    } finally {
      setIsLoading(false);

    } , []);

  /**
   * Realiza login do usu?rio
   *
   * @param {LoginData} data - Credenciais de login
   * @returns {Promise<void>} Promise que resolve quando login for conclu?do
   */
  const login = useCallback(async (data: LoginData): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Login failed');

      }
      const userData = await response;
      setUser(userData.user);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');

      throw err;
    } finally {
      setIsLoading(false);

    } , []);

  // Register
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Registration failed');

      }
      const userData = await response;
      setUser(userData.user);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');

      throw err;
    } finally {
      setIsLoading(false);

    } , []);

  // Logout
  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      await apiClient.get('/api/v1/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');

    } finally {
      setIsLoading(false);

    } , []);

  // Forgot password
  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Failed to send reset email');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email');

      throw err;
    } finally {
      setIsLoading(false);

    } , []);

  // Reset password
  const resetPassword = useCallback(async (data: ResetPasswordData): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Failed to reset password');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');

      throw err;
    } finally {
      setIsLoading(false);

    } , []);

  // Verify email
  const verifyEmail = useCallback(async (token: string): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Email verification failed');

      }
      // Refresh user data after verification
      await refreshUser();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');

      throw err;
    } finally {
      setIsLoading(false);

    } , []);

  // Resend verification email
  const resendVerification = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      setError(null);

      const data = await apiClient.get('/api/v1/auth/resend-verification', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response;
        throw new Error(errorData.message || 'Failed to resend verification email');

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email');

      throw err;
    } finally {
      setIsLoading(false);

    } , []);

  // Refresh user data
  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setError(null);

      const data = await apiClient.get('/api/v1/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response;
        setUser(userData);

      } else {
        setUser(null);

      } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh user data');

      setUser(null);

    } , []);

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
    refreshUser,};
};

/**
 * Contexto de Autentica??o (Alternativo) - DEPRECATED
 *
 * @description
 * ?? **DEPRECATED:** Este contexto ? uma vers?o alternativa.
 * Use `AuthProvider` de `@/contexts/AuthContext` como padr?o.
 */
const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider de Autentica??o (Alternativo) - DEPRECATED
 *
 * @description
 * ?? **DEPRECATED:** Use `AuthProvider` de `@/contexts/AuthContext`.
 *
 * @deprecated Use `AuthProvider` de `@/contexts/AuthContext`
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children    }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={ auth }>{children}</AuthContext.Provider>;};

/**
 * Hook para usar o contexto de autentica??o (Alternativo) - DEPRECATED
 *
 * @description
 * ?? **DEPRECATED:** Use `useAuth` de `@/contexts/AuthContext`.
 *
 * @deprecated Use `useAuth` de `@/contexts/AuthContext`
 */
export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');

  }
  return context;};

/**
 * @deprecated Use `useAuth` de `@/contexts/AuthContext`
 */
export default useAuth;
