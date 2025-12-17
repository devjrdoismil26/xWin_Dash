/**
 * Hook useAuth (Simplificado) - DEPRECATED
 *
 * @description
 * ⚠️ **DEPRECATED:** Este hook é uma versão simplificada que não é mais recomendada.
 * Use `useAuth` de `@/contexts/AuthContext` como padrão.
 *
 * Este hook usa authService ao invés de apiClient diretamente.
 * Mantido apenas para compatibilidade.
 *
 * @module hooks/api/useAuth
 * @deprecated Use `useAuth` de `@/contexts/AuthContext` ao invés deste hook
 * @since 1.0.0
 */

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { toast } from 'sonner';
import { authService } from '@/services';

/**
 * Tipo do contexto de autenticação (simplificado)
 */
interface AuthContextType {
  isAuthenticated: boolean;
  user: unknown;
  loading: boolean;
  login: (credentials: { email: string;
  password: string;
  remember?: boolean;
}) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Provider de Autenticação (Simplificado) - DEPRECATED
 *
 * @description
 * ⚠️ **DEPRECATED:** Use `AuthProvider` de `@/contexts/AuthContext`.
 *
 * @param { children: ReactNode } props - Props do provider
 * @param {ReactNode} props.children - Componentes filhos
 * @returns {JSX.Element} Provider do contexto de autenticação
 * @deprecated Use `AuthProvider` de `@/contexts/AuthContext`
 */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children,
   }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("auth_token"),);

  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const bootstrap = async () => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);

        const { data } = await authService.getUser();

        if (!cancelled) setUser(data);

      } catch (_e) {
        // token inválido
        localStorage.removeItem("auth_token");

        if (!cancelled) {
          setIsAuthenticated(false);

          setUser(null);

        } finally {
        if (!cancelled) setLoading(false);

      } ;

    bootstrap();

    return () => {
      cancelled = true;};

  }, [isAuthenticated]);

  const login = async (credentials: { email: string; password: string; remember?: boolean }) => {
    setLoading(true);

    try {
      const { data } = await authService.login(credentials);

      if (data?.token) {
        localStorage.setItem("auth_token", (data as any).token);

        setIsAuthenticated(true);

        toast.success("Login realizado com sucesso!");

        const me = await authService.getUser();

        setUser(me.data || null);

        return true;
      }
      toast.error("Credenciais inválidas");

      return false;
    } catch (_error) {
      toast.error("Falha no login");

      return false;
    } finally {
      setLoading(false);

    } ;

  const logout = async () => {
    try {
      await authService.logout();

    } catch (_error) {
      // Ignorar erros de logout
    } finally {
      localStorage.removeItem("auth_token");

      setIsAuthenticated(false);

      setUser(null);

      toast.success("Logout realizado com sucesso!");

    } ;

  const value = useMemo(
    () => ({ isAuthenticated, user, loading, login, logout }),
    [isAuthenticated, user, loading],);

  return <AuthContext.Provider value={ value }>{children}</AuthContext.Provider>;};

/**
 * Hook useAuth (Simplificado) - DEPRECATED
 *
 * @description
 * ⚠️ **DEPRECATED:** Este hook é uma versão simplificada que não é mais recomendada.
 * Use `useAuth` de `@/contexts/AuthContext` ao invés deste.
 *
 * @returns {AuthContextType} Objeto com estado e funções de autenticação
 * @throws {Error} Se usado fora de um AuthProvider
 * @deprecated Use `useAuth` de `@/contexts/AuthContext`
 *
 * @example
 * ```tsx
 * // ❌ NÃO USE (deprecated)
 * import useAuth from '@/hooks/api/useAuth';
 *
 * // ✅ USE ISSO (recomendado)
 * import { useAuth } from '@/contexts/AuthContext';
 * ```
 */
const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");

  }
  return context;};

/**
 * @deprecated Use `useAuth` de `@/contexts/AuthContext`
 */
export default useAuth;
