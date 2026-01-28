/**
 * Hook especializado para geração de conteúdo AI do módulo AI
 * Máximo: 200 linhas
 */
import { useCallback, useState, useEffect } from 'react';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
import aiService from '../services/aiService';
import { GenerateTextRequest, GenerateImageRequest, GenerateVideoRequest, AIGeneration } from '../types';

interface UseAIGenerationReturn {
  // Estado
  generations: AIGeneration[];
  currentGeneration: AIGeneration | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  loadGenerations: (filters?: AIFilters) => Promise<void>;
  createGeneration: (data: Partial<AIGeneration>) => Promise<AIGeneration>;
  updateGeneration: (id: string, data: Partial<AIGeneration>) => Promise<AIGeneration>;
  deleteGeneration: (id: string) => Promise<void>;
  
  // Utilitários
  clearError: () => void;
  refresh: () => Promise<void>;
}

export const useAIGeneration = (): UseAIGenerationReturn => {
  const [generations, setGenerations] = useState<AIGeneration[]>([]);
  const [currentGeneration, setCurrentGeneration] = useState<AIGeneration | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();

  const loadGenerations = useCallback(async (filters?: AIFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.getGenerations(filters);
      setGenerations(result.data || []);
      showSuccess('Gerações carregadas com sucesso!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar gerações';
      setError(errorMessage);
      showError('Erro ao carregar gerações', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const createGeneration = useCallback(async (data: Partial<AIGeneration>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.createGeneration(data);
      setGenerations(prev => [result.data, ...prev]);
      showSuccess('Geração criada com sucesso!');
      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar geração';
      setError(errorMessage);
      showError('Erro ao criar geração', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const updateGeneration = useCallback(async (id: string, data: Partial<AIGeneration>) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await aiService.updateGeneration(id, data);
      setGenerations(prev => prev.map(gen => gen.id === id ? result.data : gen));
      showSuccess('Geração atualizada com sucesso!');
      return result.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar geração';
      setError(errorMessage);
      showError('Erro ao atualizar geração', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  const deleteGeneration = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await aiService.deleteGeneration(id);
      setGenerations(prev => prev.filter(gen => gen.id !== id));
      showSuccess('Geração excluída com sucesso!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir geração';
      setError(errorMessage);
      showError('Erro ao excluir geração', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showSuccess, showError]);
  
  return {
    generations,
    currentGeneration,
    loading,
    error,
    loadGenerations,
    createGeneration,
    updateGeneration,
    deleteGeneration,
    clearError: () => setError(null),
    refresh: loadGenerations
  };
};
