import { useState, useEffect, useCallback, useMemo } from 'react';
import { authSettingsService, AuthSettings, AuthSettingsFormData, AuthSettingsFilters } from '../services/authSettingsService';

// =========================================
// INTERFACES
// =========================================

export interface UseAuthSettingsState {
  settings: AuthSettings[];
  currentSetting: AuthSettings | null;
  loading: boolean;
  error: string | null;
  filters: AuthSettingsFilters;
  stats: {
    total: number;
    twoFactorEnabled: boolean;
    oauthEnabled: boolean;
    rateLimitingEnabled: boolean;
  };
}

export interface UseAuthSettingsActions {
  // CRUD Operations
  loadSettings: (filters?: AuthSettingsFilters) => Promise<void>;
  loadSettingById: (id: string) => Promise<void>;
  createSetting: (data: AuthSettingsFormData) => Promise<boolean>;
  updateSetting: (id: string, data: Partial<AuthSettingsFormData>) => Promise<boolean>;
  deleteSetting: (id: string) => Promise<boolean>;
  
  // Bulk Operations
  updateMultipleSettings: (settings: Record<string, any>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  
  // Specific Settings
  updatePasswordSettings: (settings: any) => Promise<boolean>;
  updateSessionSettings: (settings: any) => Promise<boolean>;
  updateTwoFactorSettings: (settings: any) => Promise<boolean>;
  updateOAuthSettings: (providers: string[]) => Promise<boolean>;
  updateJWTSettings: (settings: any) => Promise<boolean>;
  updateIPSettings: (settings: any) => Promise<boolean>;
  updateRateLimitingSettings: (settings: any) => Promise<boolean>;
  
  // Tests and Validations
  testAuthSettings: () => Promise<boolean>;
  validatePasswordStrength: (password: string) => Promise<any>;
  generateBackupCodes: () => Promise<boolean>;
  
  // Filters and Search
  setFilters: (filters: AuthSettingsFilters) => void;
  clearFilters: () => void;
  
  // Utilities
  refreshSettings: () => Promise<void>;
  clearError: () => void;
}

export interface UseAuthSettingsReturn extends UseAuthSettingsState, UseAuthSettingsActions {}

// =========================================
// HOOK PRINCIPAL
// =========================================

export const useAuthSettings = (): UseAuthSettingsReturn => {
  // ===== ESTADO =====
  const [state, setState] = useState<UseAuthSettingsState>({
    settings: [],
    currentSetting: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      twoFactorEnabled: false,
      oauthEnabled: false,
      rateLimitingEnabled: false
    }
  });

  // ===== AÇÕES CRUD =====

  /**
   * Carregar configurações de autenticação
   */
  const loadSettings = useCallback(async (filters?: AuthSettingsFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authSettingsService.getAuthSettings(filters || state.filters);
      
      if (response.success && response.data) {
        const settings = Array.isArray(response.data) ? response.data : [response.data];
        setState(prev => ({
          ...prev,
          settings,
          loading: false,
          stats: {
            total: settings.length,
            twoFactorEnabled: settings.some(s => s.two_factor_enabled),
            oauthEnabled: settings.some(s => s.oauth_providers.length > 0),
            rateLimitingEnabled: settings.some(s => s.rate_limiting_enabled)
          }
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao carregar configurações de autenticação'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao carregar configurações de autenticação'
      }));
    }
  }, [state.filters]);

  /**
   * Carregar configuração por ID
   */
  const loadSettingById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authSettingsService.getAuthSettingById(id);
      
      if (response.success && response.data) {
        setState(prev => ({
          ...prev,
          currentSetting: response.data as AuthSettings,
          loading: false
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao carregar configuração de autenticação'
        }));
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao carregar configuração de autenticação'
      }));
    }
  }, []);

  /**
   * Criar nova configuração
   */
  const createSetting = useCallback(async (data: AuthSettingsFormData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authSettingsService.createAuthSetting(data);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao criar configuração de autenticação'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao criar configuração de autenticação'
      }));
      return false;
    }
  }, [loadSettings]);

  /**
   * Atualizar configuração
   */
  const updateSetting = useCallback(async (id: string, data: Partial<AuthSettingsFormData>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authSettingsService.updateAuthSetting(id, data);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao atualizar configuração de autenticação'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao atualizar configuração de autenticação'
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
      const response = await authSettingsService.deleteAuthSetting(id);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao deletar configuração de autenticação'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao deletar configuração de autenticação'
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
      const response = await authSettingsService.updateMultipleAuthSettings(settings);
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao atualizar configurações de autenticação'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao atualizar configurações de autenticação'
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
      const response = await authSettingsService.resetAuthSettings();
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao resetar configurações de autenticação'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao resetar configurações de autenticação'
      }));
      return false;
    }
  }, [loadSettings]);

  // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualizar configurações de senha
   */
  const updatePasswordSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('password', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de sessão
   */
  const updateSessionSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('session', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de 2FA
   */
  const updateTwoFactorSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('two_factor', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de OAuth
   */
  const updateOAuthSettings = useCallback(async (providers: string[]): Promise<boolean> => {
    return updateSetting('oauth', { oauth_providers: providers });
  }, [updateSetting]);

  /**
   * Atualizar configurações de JWT
   */
  const updateJWTSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('jwt', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de IP
   */
  const updateIPSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('ip', settings);
  }, [updateSetting]);

  /**
   * Atualizar configurações de rate limiting
   */
  const updateRateLimitingSettings = useCallback(async (settings: any): Promise<boolean> => {
    return updateSetting('rate_limiting', settings);
  }, [updateSetting]);

  // ===== TESTES E VALIDAÇÕES =====

  /**
   * Testar configurações de autenticação
   */
  const testAuthSettings = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authSettingsService.testAuthSettings();
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao testar configurações de autenticação'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao testar configurações de autenticação'
      }));
      return false;
    }
  }, []);

  /**
   * Validar força da senha
   */
  const validatePasswordStrength = useCallback(async (password: string): Promise<any> => {
    try {
      const response = await authSettingsService.validatePasswordStrength(password);
      return response.data;
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || 'Erro ao validar força da senha'
      }));
      return null;
    }
  }, []);

  /**
   * Gerar códigos de backup
   */
  const generateBackupCodes = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await authSettingsService.generateBackupCodes();
      
      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error || 'Erro ao gerar códigos de backup'
        }));
        return false;
      }
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Erro inesperado ao gerar códigos de backup'
      }));
      return false;
    }
  }, []);

  // ===== FILTROS E BUSCA =====

  /**
   * Definir filtros
   */
  const setFilters = useCallback((filters: AuthSettingsFilters) => {
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
    return authSettingsService.getDefaultAuthSettings();
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
    updatePasswordSettings,
    updateSessionSettings,
    updateTwoFactorSettings,
    updateOAuthSettings,
    updateJWTSettings,
    updateIPSettings,
    updateRateLimitingSettings,
    
    // Testes e validações
    testAuthSettings,
    validatePasswordStrength,
    generateBackupCodes,
    
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

export default useAuthSettings;
