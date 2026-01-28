import { useState, useCallback } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

interface UserAdvanced {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  roles: string[];
}

interface UseUsersAdvancedReturn {
  users: UserAdvanced[];
  loading: boolean;
  error: string | null;
  loadUsers: () => Promise<void>;
  updateUserPermissions: (userId: string, permissions: string[]) => Promise<void>;
  updateUserRoles: (userId: string, roles: string[]) => Promise<void>;
}

export const useUsersAdvanced = (): UseUsersAdvancedReturn => {
  const [users, setUsers] = useState<UserAdvanced[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de carregamento de usuários
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUsers([
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          permissions: ['read', 'write'],
          roles: ['admin', 'user']
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@example.com',
          permissions: ['read'],
          roles: ['user']
        }
      ]);
      showSuccess('Usuários carregados com sucesso!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar usuários';
      setError(errorMessage);
      showError('Erro ao carregar usuários', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);

  const updateUserPermissions = useCallback(async (userId: string, permissions: string[]) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, permissions } : user
      ));
      showSuccess('Permissões atualizadas com sucesso!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar permissões';
      showError('Erro ao atualizar permissões', errorMessage);
    }
  }, [showSuccess, showError]);

  const updateUserRoles = useCallback(async (userId: string, roles: string[]) => {
    try {
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, roles } : user
      ));
      showSuccess('Funções atualizadas com sucesso!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar funções';
      showError('Erro ao atualizar funções', errorMessage);
    }
  }, [showSuccess, showError]);

  return {
    users,
    loading,
    error,
    loadUsers,
    updateUserPermissions,
    updateUserRoles
  };
};