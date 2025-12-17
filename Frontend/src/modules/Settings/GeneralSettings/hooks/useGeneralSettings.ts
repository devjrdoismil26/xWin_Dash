import { useState, useEffect, useCallback, useMemo } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { generalSettingsService, GeneralSettings, GeneralSettingsFormData, GeneralSettingsFilters } from '../services/generalSettingsService';

// =========================================
// INTERFACES
// =========================================

export interface UseGeneralSettingsState {
  settings: GeneralSettings[];
  currentSetting: GeneralSettings | null;
  loading: boolean;
  error: string | null;
  filters: GeneralSettingsFilters;
  stats: {
    total: number;
  active: number;
  maintenanceMode: boolean;
  debugMode: boolean;
  [key: string]: unknown; };

}

export interface UseGeneralSettingsActions {
  // CRUD Operations
  loadSettings: (filters?: GeneralSettingsFilters) => Promise<void>;
  loadSettingById: (id: string) => Promise<void>;
  createSetting: (data: GeneralSettingsFormData) => Promise<boolean>;
  updateSetting: (id: string, data: Partial<GeneralSettingsFormData>) => Promise<boolean>;
  deleteSetting: (id: string) => Promise<boolean>;
  // Bulk Operations
  updateMultipleSettings: (settings: Record<string, any>) => Promise<boolean>;
  resetSettings: () => Promise<boolean>;
  // Specific Settings
  updateTheme: (theme: 'light' | 'dark' | 'auto') => Promise<boolean>;
  updateLanguage: (language: string) => Promise<boolean>;
  updateTimezone: (timezone: string) => Promise<boolean>;
  updateMaintenanceMode: (enabled: boolean) => Promise<boolean>;
  updateDebugMode: (enabled: boolean) => Promise<boolean>;
  updateLogLevel: (level: 'error' | 'warn' | 'info' | 'debug') => Promise<boolean>;
  // Filters and Search
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  // Utilities
  refreshSettings: () => Promise<void>;
  clearError??: (e: any) => void;
  [key: string]: unknown; }

export interface UseGeneralSettingsReturn extends UseGeneralSettingsState, UseGeneralSettingsActions {}

// =========================================
// HOOK PRINCIPAL
// =========================================

export const useGeneralSettings = (): UseGeneralSettingsReturn => {
  // ===== ESTADO =====
  const [state, setState] = useState<UseGeneralSettingsState>({
    settings: [],
    currentSetting: null,
    loading: false,
    error: null,
    filters: {},
    stats: {
      total: 0,
      active: 0,
      maintenanceMode: false,
      debugMode: false
    } );

  // ===== AÇÕES CRUD =====

  /**
   * Carregar configurações gerais
   */
  const loadSettings = useCallback(async (filters?: GeneralSettingsFilters) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.getGeneralSettings(filters || state.filters);

      if (response.success && (response as any).data) {
        const settings = Array.isArray(response.data) ? (response as any).data : [response.data];
        setState(prev => ({
          ...prev,
          settings,
          loading: false,
          stats: {
            total: settings.length,
            active: settings.filter(s => !s.maintenance_mode).length,
            maintenanceMode: settings.some(s => s.maintenance_mode),
            debugMode: settings.some(s => s.debug_mode)
  } ));

      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao carregar configurações'
        }));

      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao carregar configurações'
      }));

    } , [state.filters]);

  /**
   * Carregar configuração por ID
   */
  const loadSettingById = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.getGeneralSettingById(id);

      if (response.success && (response as any).data) {
        setState(prev => ({
          ...prev,
          currentSetting: (response as any).data as GeneralSettings,
          loading: false
        }));

      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao carregar configuração'
        }));

      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao carregar configuração'
      }));

    } , []);

  /**
   * Criar nova configuração
   */
  const createSetting = useCallback(async (data: GeneralSettingsFormData): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.createGeneralSetting(data);

      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));

        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao criar configuração'
        }));

        return false;
      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao criar configuração'
      }));

      return false;
    } , [loadSettings]);

  /**
   * Atualizar configuração
   */
  const updateSetting = useCallback(async (id: string, data: Partial<GeneralSettingsFormData>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.updateGeneralSetting(id, data);

      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));

        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao atualizar configuração'
        }));

        return false;
      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao atualizar configuração'
      }));

      return false;
    } , [loadSettings]);

  /**
   * Deletar configuração
   */
  const deleteSetting = useCallback(async (id: string): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.deleteGeneralSetting(id);

      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));

        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao deletar configuração'
        }));

        return false;
      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao deletar configuração'
      }));

      return false;
    } , [loadSettings]);

  // ===== OPERAÇÕES EM LOTE =====

  /**
   * Atualizar múltiplas configurações
   */
  const updateMultipleSettings = useCallback(async (settings: Record<string, any>): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.updateMultipleGeneralSettings(settings);

      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));

        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao atualizar configurações'
        }));

        return false;
      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao atualizar configurações'
      }));

      return false;
    } , [loadSettings]);

  /**
   * Resetar configurações
   */
  const resetSettings = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await generalSettingsService.resetGeneralSettings();

      if (response.success) {
        setState(prev => ({ ...prev, loading: false }));

        await loadSettings(); // Recarregar lista
        return true;
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: (response as any).error || 'Erro ao resetar configurações'
        }));

        return false;
      } catch (error: unknown) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: getErrorMessage(error) + ' ao resetar configurações'
      }));

      return false;
    } , [loadSettings]);

  // ===== CONFIGURAÇÕES ESPECÍFICAS =====

  /**
   * Atualizar tema
   */
  const updateTheme = useCallback(async (theme: 'light' | 'dark' | 'auto'): Promise<boolean> => {
    return updateSetting('theme', { theme });

  }, [updateSetting]);

  /**
   * Atualizar idioma
   */
  const updateLanguage = useCallback(async (language: string): Promise<boolean> => {
    return updateSetting('language', { language });

  }, [updateSetting]);

  /**
   * Atualizar timezone
   */
  const updateTimezone = useCallback(async (timezone: string): Promise<boolean> => {
    return updateSetting('timezone', { timezone });

  }, [updateSetting]);

  /**
   * Atualizar modo de manutenção
   */
  const updateMaintenanceMode = useCallback(async (enabled: boolean): Promise<boolean> => {
    return updateSetting('maintenance_mode', { maintenance_mode: enabled });

  }, [updateSetting]);

  /**
   * Atualizar modo de debug
   */
  const updateDebugMode = useCallback(async (enabled: boolean): Promise<boolean> => {
    return updateSetting('debug_mode', { debug_mode: enabled });

  }, [updateSetting]);

  /**
   * Atualizar nível de log
   */
  const updateLogLevel = useCallback(async (level: 'error' | 'warn' | 'info' | 'debug'): Promise<boolean> => {
    return updateSetting('log_level', { log_level: level });

  }, [updateSetting]);

  // ===== FILTROS E BUSCA =====

  /**
   * Definir filtros
   */
  const setFilters = useCallback((filters: GeneralSettingsFilters) => {
    setState(prev => ({ ...prev, filters }));

  }, []);

  /**
   * Limpar filtros
   */
  const clearFilters = useCallback(() => {
    setState(prev => ({ ...prev, filters: {} ));

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

    } , [state.filters, loadSettings]);

  // ===== VALORES MEMOIZADOS =====

  const filteredSettings = useMemo(() => {
    return state.settings.filter(setting => {
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();

        return setting.app_name.toLowerCase().includes(search) ||
               setting.app_description?.toLowerCase().includes(search);

      }
      return true;
    });

  }, [state.settings, state.filters]);

  const defaultSettings = useMemo(() => {
    return generalSettingsService.getDefaultGeneralSettings();

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
    updateTheme,
    updateLanguage,
    updateTimezone,
    updateMaintenanceMode,
    updateDebugMode,
    updateLogLevel,
    
    // Filtros e busca
    setFilters,
    clearFilters,
    
    // Utilitários
    refreshSettings,
    clearError};
};

// =========================================
// EXPORTS
// =========================================

export default useGeneralSettings;
