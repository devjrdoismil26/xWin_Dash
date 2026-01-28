import { useState, useEffect, useCallback, useMemo } from 'react';
import { userSettingsService, UserSettings, UserSettingsFormData, UserSettingsFilters } from '../services/userSettingsService';

// =========================================
// INTERFACES
// =========================================

export interface UseUserSettingsState {
  settings: UserSettings[];
  currentSetting: UserSettings | null;
  loading: boolean;
  error: string | null;
  filters: UserSettingsFilters;
  stats: {
    total: number;
    activeUsers: number;
    pendingUsers: number;
    registeredUsers: number;
  };
}

export interface UseUserSettingsActions {
  // CRUD Operations
  loadSettings: (filters?: UserSettingsFilters) => Promise<void>;
  loadSettingById: (id: string) => Promise<void>;
  createSetting: (data: UserSettingsFormData) => Promise<boolean>;
  updateSetting: (id: string, data: Partial<UserSettingsFormData>) => Promise<boolean>;
  deleteSetting: (id: string) => Promise<boolean>;
  
  // Bulk Operations
  updateMultipleSettings: (settings: Record<string, any>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  
  // Specific Settings
  updateRegistrationSettings: (settings: any) => Promise<boolean>;
  updateProfileSettings: (settings: any) => Promise<boolean>;
  updateUsernameSettings: (settings: any) => Promise<boolean>;
  updatePasswordSettings: (settings: any) => Promise<boolean>;
  updateAccountLockingSettings: (settings: any) => Promise<boolean>;
  updateSessionSettings: (settings: any) => Promise<boolean>;
  updatePrivacySettings: (settings: any) => Promise<boolean>;
  updateNotificationSettings: (settings: any) => Promise<boolean>;
  
  // Tests and Validations
  testUserSettings: () => Promise<boolean>;
  validateUsername: (username: string) => Promise<any>;
  checkUsernameAvailability: (username: string) => Promise<boolean>;
  
  // Filters and Search
  setFilters: (filters: UserSettingsFilters) => void;
  clearFilters: () => void;
  
  // Utilities
  refreshSettings: () => Promise<void>;
  clearError: () => void;
}

export interface UseUserSettingsReturn extends UseUserSettingsState, UseUserSettingsActions {}

// =========================================
// HOOK PRINCIPAL
// =========================================

export const useUserSettings = (): UseUserSettingsReturn => {
  // ===== ESTADO =====
  const [state, setState] = useState<UseUserSettingsState>({
    settings: [],
    currentSetting: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      activeUsers: 0,
      pendingUsers: 0,
      registeredUsers: 0
    }
  });

  // ===== AÇÕES CRUD =====

  /**
   * Carregar configurações de usuário
   */
  const loadSettings = useCallback(async (filters?: UserSettingsFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.getUserSettings(filters || state.filters);
      
      if (response.success && response.data) {
        const settings = Array.isArray(response.data) ? response.data : [response.data];
        setState(prev => ({
          ...prev,
          settings,
          loading: false,
          stats: {
            total: settings.length,
            activeUsers: settings.filter(s => s.default_user_status === 'active').length,
            pendingUsers: settings.filter(s => s.default_user_status === 'pending').length,
            registeredUsers: settings.filter(s => s.allow_self_registration).length
          }
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao carregar configurações de usuário'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao carregar configurações de usuário'
      }));
    }
  }, [state.filters]);

  /**
   * Carregar configuração por ID
   */
  const loadSettingById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.getUserSettingById(id);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          currentSetting: response.data as UserSettings,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao carregar configuração de usuário'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao carregar configuração de usuário'
      }));
    }
  }, []);

  /**
   * Criar nova configuração
   */
  const createSetting = useCallback(async (data: UserSettingsFormData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.createUserSetting(data);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao criar configuração de usuário'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao criar configuração de usuário'
      }));
      return false;
    }
  }, [loadSettings]);

  /**
   * Atualizar configuração
   */
  const updateSetting = useCallback(async (id: string, data: Partial<UserSettingsFormData>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.updateUserSetting(id, data);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao atualizar configuração de usuário'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao atualizar configuração de usuário'
      }));
      return false;
    }
  }, [loadSettings]);

  /**
   * Deletar configuração
   */
  const deleteSetting = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.deleteUserSetting(id);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao deletar configuração de usuário'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao deletar configuração de usuário'
      }));
      return false;
    }
  }, [loadSettings]);

  // ===== OPERAÇÕES EM LOTE =====

  /**
   * Atualizar múltiplas configurações
   */
  const updateMultipleSettings = useCallback(async (settings: Record<string, any>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.updateMultipleUserSettings(settings);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao atualizar configurações de usuário'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao atualizar configurações de usuário'
      }));
      return false;
    }
  }, [loadSettings]);

  /**
   * Resetar configurações
   */
  const resetSettings = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.resetUserSettings();
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao resetar configurações de usuário'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao resetar configurações de usuário'
      }));
      return false;
    }
  }, [loadSettings]);

  // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualizar configurações de registro
   */
  const updateRegistrationSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('registration', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de perfil
   */
  const updateProfileSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('profile', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de username
   */
  const updateUsernameSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('username', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de senha
   */
  const updatePasswordSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('password', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de bloqueio de conta
   */
  const updateAccountLockingSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('account_locking', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de sessão
   */
  const updateSessionSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('session', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de privacidade
   */
  const updatePrivacySettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('privacy', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de notificação
   */
  const updateNotificationSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('notifications', settings);
  }, [updateSetting]);

  // ===== TESTES E VALIDAÇÕES =====

  /**
   * Testar configurações de usuário
   */
  const testUserSettings = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await userSettingsService.testUserSettings();
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao testar configurações de usuário'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao testar configurações de usuário'
      }));
      return false;
    }
  }, []);

  /**
   * Validar username
   */
  const validateUsername = useCallback(async (username: string): Promise<any> => {
    try {
      const response = await userSettingsService.validateUsername(username);
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao validar username'
      }));
      return null;
    }
  }, []);

  /**
   * Verificar disponibilidade de username
   */
  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    try {
      const response = await userSettingsService.checkUsernameAvailability(username);
      return response.success && response.data?.available;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao verificar disponibilidade do username'
      }));
      return false;
    }
  }, []);

  // ===== FILTROS E BUSCA =====

  /**
   * Definir filtros
   */
  const setFilters = useCallback((filters: UserSettingsFilters) => {
    setState(prev => ({ ...prev, filters }));
  }, []);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: {} }));
  }, []);

  // ===== UTILITÁRIOS =====

  /**
   * Atualizar configurações
   */
  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  /**
   * Limpar erro
   */
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // ===== EFEITOS =====

  // Carregar configurações na inicialização
  useEffect(() => {
    loadSettings();
  }, []);

  // Recarregar quando filtros mudarem
  useEffect(() => {
    if (Object.keys(state.filters).length > 0) {
      loadSettings();
    }
  }, [state.filters, loadSettings]);

  // ===== VALORES MEMOIZADOS =====

  const filteredSettings = useMemo(() => {
    return state.settings.filter(setting => {
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        return setting.id?.toLowerCase().includes(search);
      }
      return true;
    });
  }, [state.settings, state.filters]);

  const defaultSettings = useMemo(() => {
    return userSettingsService.getDefaultUserSettings();
  }, []);

  // ===== RETORNO =====

  return {
    // Estado
    ...state,
    settings: filteredSettings,
    
    // Ações CRUD
    loadSettings,
    loadSettingById,
    createSetting,
    updateSetting,
    deleteSetting,
    
    // Operações em lote
    updateMultipleSettings,
    resetSettings,
    
    // Configurações específicas
    updateRegistrationSettings,
    updateProfileSettings,
    updateUsernameSettings,
    updatePasswordSettings,
    updateAccountLockingSettings,
    updateSessionSettings,
    updatePrivacySettings,
    updateNotificationSettings,
    
    // Testes e validações
    testUserSettings,
    validateUsername,
    checkUsernameAvailability,
    
    // Filtros e busca
    setFilters,
    clearFilters,
    
    // Utilitários
    refreshSettings,
    clearError
  };
};

// =========================================
// EXPORTS
// =========================================

export default useUserSettings;
