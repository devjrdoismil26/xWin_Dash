/**
 * Hook orquestrador do módulo AI
 * Coordena todos os hooks especializados em uma interface unificada
 * Máximo: 200 linhas
 */
import { useCallback, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import { useAIStore } from './useAIStore';
import { useAIGeneration } from './useAIGeneration';
import { useAIProviders } from './useAIProviders';
import { useAIHistory } from './useAIHistory';
import { useAIAnalytics } from './useAIAnalytics';
import { AIProvider, AIGenerationType } from '../types';

interface UseAIReturn {
  // Estado consolidado
  loading: boolean;
  error: string | null;
  
  // Dados principais
  generations: AIGeneration[];
  currentGeneration: AIGeneration | null;
  providers: AIProvider[];
  chatHistory: AIChatMessage[];
  analytics: AIAnalytics | null;
  
  // Ações principais
  loadGenerations: (filters?: AIFilters) => Promise<void>;
  createGeneration: (data: Partial<AIGeneration>) => Promise<AIGeneration>;
  updateGeneration: (id: string, data: Partial<AIGeneration>) => Promise<AIGeneration>;
  deleteGeneration: (id: string) => Promise<void>;
  
  // Hooks especializados
  generation: ReturnType<typeof useAIGeneration>;
  providers: ReturnType<typeof useAIProviders>;
  history: ReturnType<typeof useAIHistory>;
  analytics: ReturnType<typeof useAIAnalytics>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAI = (): UseAIReturn => {
  const { showSuccess, showError } = useAdvancedNotifications();
  const store = useAIStore();
  const generation = useAIGeneration();
  const providers = useAIProviders();
  const history = useAIHistory();
  const analytics = useAIAnalytics();
  
  // Lógica de orquestração
  const loadGenerations = useCallback(async (filters?: AIFilters) => {
    try {
      await generation.loadGenerations(filters);
      showSuccess('Gerações carregadas com sucesso!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showError('Erro ao carregar gerações', errorMessage);
    }
  }, [generation, showSuccess, showError]);
  
  const createGeneration = useCallback(async (data: Partial<AIGeneration>) => {
    try {
      const result = await generation.createGeneration(data);
      showSuccess('Geração criada com sucesso!');
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showError('Erro ao criar geração', errorMessage);
      throw error;
    }
  }, [generation, showSuccess, showError]);
  
  const updateGeneration = useCallback(async (id: string, data: Partial<AIGeneration>) => {
    try {
      const result = await generation.updateGeneration(id, data);
      showSuccess('Geração atualizada com sucesso!');
      return result;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showError('Erro ao atualizar geração', errorMessage);
      throw error;
    }
  }, [generation, showSuccess, showError]);
  
  const deleteGeneration = useCallback(async (id: string) => {
    try {
      await generation.deleteGeneration(id);
      showSuccess('Geração excluída com sucesso!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      showError('Erro ao excluir geração', errorMessage);
      throw error;
    }
  }, [generation, showSuccess, showError]);
  
  return {
    loading: store.loading || generation.loading || providers.loading || history.loading || analytics.loading,
    error: store.error || generation.error || providers.error || history.error || analytics.error,
    generations: store.textGenerations.concat(store.imageGenerations).concat(store.videoGenerations),
    currentGeneration: store.currentGeneration,
    providers: store.providers,
    chatHistory: store.chatHistory,
    analytics: store.analytics,
    loadGenerations,
    createGeneration,
    updateGeneration,
    deleteGeneration,
    clearError: () => {
      store.clearError();
      generation.clearError();
      providers.clearError();
      history.clearError();
      analytics.clearError();
    },
    refresh: loadGenerations
  };
};
