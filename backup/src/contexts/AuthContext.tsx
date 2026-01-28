import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import { apiClient } from '@/services';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<User>;
  register: (userData: RegisterData) => Promise<User>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
  can: (permission: string) => boolean;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { auth } = usePage().props as any;

  const [user, setUser] = useState<User | null>(auth?.user ?? null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  const setAuthData = useCallback((userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('token', authToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  }, []);

  const clearAuthData = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const response = await api.get<User>('/api/user');
      setUser(response.data);
    } catch (_) {
      // ignore
    }
  }, [token]);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiClient.get<User>('/api/user');
          setUser(response.data);
        } catch (_) {
          // ignore
        }
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<User> => {
    try {
      setLoading(true);
      const response = await apiClient.post<{ user: User; token: string }>('/login', credentials);
      setAuthData(response.data.user, response.data.token);
      toast.success('Login realizado com sucesso!');
      return response.data.user;
    } catch (error: unknown) {
      let errorMessage = 'Credenciais inválidas ou erro de servidor.';
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error('Falha no login.', { description: errorMessage });
      throw error as any;
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const register = useCallback(async (userData: RegisterData): Promise<User> => {
    try {
      setLoading(true);
      const response = await apiClient.post<{ user: User; token: string }>('/register', userData);
      setAuthData(response.data.user, response.data.token);
      toast.success('Registro realizado com sucesso!');
      return response.data.user;
    } catch (error: unknown) {
      let errorMessage = 'Erro ao criar conta. Tente novamente.';
      if (isAxiosError(error) && error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      toast.error('Falha no registro.', { description: errorMessage });
      throw error as any;
    } finally {
      setLoading(false);
    }
  }, [setAuthData]);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiClient.post('/logout');
      clearAuthData();
      toast.info('Você foi desconectado.');
    } catch (error: unknown) {
      clearAuthData();
      let errorMessage = 'Não foi possível desconectar.';
      if (isAxiosError(error) && (error as any).response?.data?.message) {
        errorMessage = (error as any).response.data.message;
      }
      toast.error('Erro ao desconectar.', { description: errorMessage });
    }
  }, [clearAuthData]);

  const hasRole = useCallback((role: string): boolean => {
    if (!user?.roles) return false;
    return user.roles.includes(role);
  }, [user?.roles]);

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user?.roles) return false;
    return roles.some((role) => user.roles.includes(role));
  }, [user?.roles]);

  const can = useCallback((permission: string): boolean => {
    if (!user?.permissions) return false;
    return user.permissions.includes(permission);
  }, [user?.permissions]);

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    token,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasAnyRole,
    can,
    refreshUser,
    isAuthenticated: Boolean(user && token),
  }), [user, token, loading, login, register, logout, hasRole, hasAnyRole, can, refreshUser]);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const usePermission = (permission: string): boolean => {
  const { can } = useAuth();
  return can(permission);
};

export const useRole = (role: string): boolean => {
  const { hasRole } = useAuth();
  return hasRole(role);
};

export const useAnyRole = (roles: string[]): boolean => {
  const { hasAnyRole } = useAuth();
  return hasAnyRole(roles);
};

export default AuthContext;
