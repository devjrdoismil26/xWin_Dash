import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { authService } from '@/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('auth_token'));
  const [user, setUser] = useState(null);
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
        localStorage.removeItem('auth_token');
        if (!cancelled) {
          setIsAuthenticated(false);
          setUser(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authService.login(credentials);
      if (data?.token) {
        localStorage.setItem('auth_token', data.token);
        setIsAuthenticated(true);
        toast.success('Login realizado com sucesso!');
        const me = await authService.getUser();
        setUser(me.data || null);
        return true;
      }
      toast.error('Credenciais inválidas');
      return false;
    } catch (_error) {
      toast.error('Falha no login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (_error) {
      // Ignorar erros de logout
    } finally {
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
      toast.success('Logout realizado com sucesso!');
    }
  };

  const value = useMemo(
    () => ({ isAuthenticated, user, loading, login, logout }),
    [isAuthenticated, user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
};

export default useAuth;
