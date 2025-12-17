/**
 * Hook orquestrador do módulo Settings
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useSettingsStore } from './useSettingsStore';
import { useApiConfigurations } from './useApiConfigurations';
import { Settings, ApiConfiguration } from '../types';

interface UseSettingsReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  // Dados principais
  settings: Settings | null;
  apiConfigurations: ApiConfiguration[];
  // Ações principais
  loadSettings: () => Promise<void>;
  updateSettings: (data: Partial<Settings>) => Promise<Settings>;
  saveSettings: () => Promise<void>;
  resetSettings: () => Promise<void>;
  // Hooks especializados
  apiConfig: ReturnType<typeof useApiConfigurations>;
  // Utilitários
  clearError??: (e: any) => void;
  refresh: () => Promise<void>;
  [key: string]: unknown; }

export const useSettings = (): UseSettingsReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();

  const store = useSettingsStore();

  const apiConfig = useApiConfigurations();

  // Lógica de orquestração
  const loadSettings = useCallback(async () => {
    try {
      await store.loadSettings();

      showSuccess('Configurações carregadas com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao carregar configurações', getErrorMessage(error));

    } , [store, showSuccess, showError]);

  const updateSettings = useCallback(async (data: Partial<Settings>) => {
    try {
      const result = await store.updateSettings(data);

      showSuccess('Configurações atualizadas com sucesso!');

      return result;
    } catch (error: unknown) {
      showError('Erro ao atualizar configurações', getErrorMessage(error));

      throw error;
    } , [store, showSuccess, showError]);

  const saveSettings = useCallback(async () => {
    try {
      await store.saveSettings();

      showSuccess('Configurações salvas com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao salvar configurações', getErrorMessage(error));

      throw error;
    } , [store, showSuccess, showError]);

  const resetSettings = useCallback(async () => {
    try {
      await store.resetSettings();

      showSuccess('Configurações resetadas com sucesso!');

    } catch (error: unknown) {
      showError('Erro ao resetar configurações', getErrorMessage(error));

      throw error;
    } , [store, showSuccess, showError]);

  // Inicialização
  useEffect(() => {
    loadSettings();

    apiConfig.loadConfigurations();

  }, []);

  return {
    loading: store.loading || apiConfig.loading,
    error: store.error || apiConfig.error,
    settings: store.settings,
    apiConfigurations: store.apiConfigurations,
    loadSettings,
    updateSettings,
    saveSettings,
    resetSettings,
    apiConfig,
    clearError: () => {
      store.clearError();

      apiConfig.clearError();

    },
    refresh: loadSettings};
};
