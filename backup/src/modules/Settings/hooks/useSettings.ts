import { useState, useEffect, useCallback, useMemo } from 'react';
import { useGeneralSettings } from '../GeneralSettings/hooks/useGeneralSettings';
import { useAuthSettings } from '../AuthSettings/hooks/useAuthSettings';
import { useUserSettings } from '../UserSettings/hooks/useUserSettings';
import { useSettingsOptimization } from './useSettingsOptimization';

// =========================================
// INTERFACES
// =========================================

export interface UseSettingsState {
  // Estados dos submódulos
  generalSettings: ReturnType<typeof useGeneralSettings>;
  authSettings: ReturnType<typeof useAuthSettings>;
  userSettings: ReturnType<typeof useUserSettings>;
  
  // Estado global
  loading: boolean;
  error: string | null;
  activeCategory: string;
  
  // Estatísticas consolidadas
  stats: {
    totalSettings: number;
    totalCategories: number;
    activeSettings: number;
    maintenanceMode: boolean;
    debugMode: boolean;
    twoFactorEnabled: boolean;
    oauthEnabled: boolean;
  };
}

export interface UseSettingsActions {
  // Navegação
  setActiveCategory: (category: string) => void;
  
  // Operações globais
  refreshAllSettings: () => Promise<void>;
  resetAllSettings: () => Promise<boolean>;
  
  // Utilitários
  clearAllErrors: () => void;
  getSettingsByCategory: (category: string) => any;
}

export interface UseSettingsReturn extends UseSettingsState, UseSettingsActions {}

// =========================================
// HOOK PRINCIPAL
// =========================================

export const useSettings = (): UseSettingsReturn => {
  // ===== HOOKS DOS SUBMÓDULOS =====
  const generalSettings = useGeneralSettings();
  const authSettings = useAuthSettings();
  const userSettings = useUserSettings();
  const optimization = useSettingsOptimization();

  // ===== ESTADO GLOBAL =====
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ===== ESTATÍSTICAS CONSOLIDADAS =====
  const stats = useMemo(() => {
    return {
      totalSettings: generalSettings.stats.total + authSettings.stats.total + userSettings.stats.total,
      totalCategories: 8, // Total de categorias de configurações
      activeSettings: generalSettings.stats.active + authSettings.stats.total + userSettings.stats.activeUsers,
      maintenanceMode: generalSettings.stats.maintenanceMode,
      debugMode: generalSettings.stats.debugMode,
      twoFactorEnabled: authSettings.stats.twoFactorEnabled,
      oauthEnabled: authSettings.stats.oauthEnabled,
      activeUsers: userSettings.stats.activeUsers,
      pendingUsers: userSettings.stats.pendingUsers
    };
  }, [
    generalSettings.stats,
    authSettings.stats,
    userSettings.stats
  ]);

  // ===== AÇÕES =====

  /**
   * Definir categoria ativa
   */
  const handleSetActiveCategory = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  /**
   * Atualizar todas as configurações
   */
  const refreshAllSettings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        generalSettings.refreshSettings(),
        authSettings.refreshSettings(),
        userSettings.refreshSettings()
      ]);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar configurações');
    } finally {
      setLoading(false);
    }
  }, [generalSettings, authSettings]);

  /**
   * Resetar todas as configurações
   */
  const resetAllSettings = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.all([
        generalSettings.resetSettings(),
        authSettings.resetSettings(),
        userSettings.resetSettings()
      ]);

      const allSuccess = results.every(result => result === true);
      
      if (!allSuccess) {
        setError('Algumas configurações não puderam ser resetadas');
      }

      return allSuccess;
    } catch (err: any) {
      setError(err.message || 'Erro ao resetar configurações');
      return false;
    } finally {
      setLoading(false);
    }
  }, [generalSettings, authSettings]);

  /**
   * Limpar todos os erros
   */
  const clearAllErrors = useCallback(() => {
    setError(null);
    generalSettings.clearError();
    authSettings.clearError();
    userSettings.clearError();
  }, [generalSettings, authSettings, userSettings]);

  /**
   * Obter configurações por categoria
   */
  const getSettingsByCategory = useCallback((category: string) => {
    switch (category) {
      case 'general':
        return generalSettings;
      case 'auth':
        return authSettings;
      case 'users':
        return userSettings;
      default:
        return null;
    }
  }, [generalSettings, authSettings, userSettings]);

  // ===== EFEITOS =====

  // Carregar configurações na inicialização
  useEffect(() => {
    refreshAllSettings();
  }, []);

  // Preload de dados baseado na categoria ativa
  useEffect(() => {
    const preloadCategoryData = async () => {
      switch (activeCategory) {
        case 'general':
          await optimization.preloadData('general-settings', () => generalSettings.loadSettings());
          break;
        case 'auth':
          await optimization.preloadData('auth-settings', () => authSettings.loadSettings());
          break;
      }
    };

    preloadCategoryData();
  }, [activeCategory, optimization, generalSettings, authSettings]);

  // ===== ESTADO CONSOLIDADO =====
  const consolidatedLoading = useMemo(() => {
    return loading || generalSettings.loading || authSettings.loading || userSettings.loading;
  }, [loading, generalSettings.loading, authSettings.loading, userSettings.loading]);

  const consolidatedError = useMemo(() => {
    return error || generalSettings.error || authSettings.error || userSettings.error;
  }, [error, generalSettings.error, authSettings.error, userSettings.error]);

  // ===== RETORNO =====

  return {
    // Estado dos submódulos
    generalSettings,
    authSettings,
    userSettings,
    
    // Estado global
    loading: consolidatedLoading,
    error: consolidatedError,
    activeCategory,
    
    // Estatísticas
    stats,
    
    // Ações
    setActiveCategory: handleSetActiveCategory,
    refreshAllSettings,
    resetAllSettings,
    clearAllErrors,
    getSettingsByCategory
  };
};

// =========================================
// EXPORTS
// =========================================

export default useSettings;
