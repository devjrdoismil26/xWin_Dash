/**
 * Hook especializado para gerenciamento de histórico AI
 * Gerencia histórico de gerações, chat e análises
 */
import { useCallback, useState, useEffect } from 'react';
// import { useAIStore } from './useAIStore';
import { AIHistoryItem, AIChatSession, AIFilters } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

export const useAIHistory = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<AIFilters>({});
  
  const {
    textGenerations,
    imageGenerations,
    videoGenerations,
    chatHistory,
    analysisHistory,
    getHistory
  } = useAIStore();

  // Carregar histórico na inicialização
  useEffect(() => {
    loadHistory();
  }, []);

  // Carregar histórico
  const loadHistory = useCallback(async (newFilters?: AIFilters) => {
    setLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      await getHistory(currentFilters);
      if (newFilters) {
        setFilters(currentFilters);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar histórico';
      setError(errorMessage);
      notify('error', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [getHistory, filters]);

  // Aplicar filtros
  const applyFilters = useCallback((newFilters: AIFilters) => {
    setFilters(newFilters);
    loadHistory(newFilters);
  }, [loadHistory]);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters({});
    loadHistory({});
  }, [loadHistory]);

  // Obter histórico completo
  const getAllHistory = useCallback((): AIHistoryItem[] => {
    const allGenerations = [
      ...textGenerations.map(gen => ({
        id: gen.id,
        type: gen.type,
        prompt: gen.prompt,
        result: gen.result,
        provider: gen.provider,
        model: gen.model,
        created_at: gen.created_at,
        metadata: gen.metadata
      })),
      ...analysisHistory
    ];

    return allGenerations.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [textGenerations, analysisHistory]);

  // Obter histórico por tipo
  const getHistoryByType = useCallback((type: 'text' | 'image' | 'video' | 'analysis'): AIHistoryItem[] => {
    const allHistory = getAllHistory();
    return allHistory.filter(item => item.type === type);
  }, [getAllHistory]);

  // Obter histórico por provedor
  const getHistoryByProvider = useCallback((provider: string): AIHistoryItem[] => {
    const allHistory = getAllHistory();
    return allHistory.filter(item => item.provider === provider);
  }, [getAllHistory]);

  // Obter histórico por período
  const getHistoryByPeriod = useCallback((startDate: string, endDate: string): AIHistoryItem[] => {
    const allHistory = getAllHistory();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return allHistory.filter(item => {
      const itemDate = new Date(item.created_at);
      return itemDate >= start && itemDate <= end;
    });
  }, [getAllHistory]);

  // Buscar no histórico
  const searchHistory = useCallback((query: string): AIHistoryItem[] => {
    const allHistory = getAllHistory();
    const lowercaseQuery = query.toLowerCase();
    
    return allHistory.filter(item => 
      item.prompt.toLowerCase().includes(lowercaseQuery) ||
      item.result.toLowerCase().includes(lowercaseQuery) ||
      item.model.toLowerCase().includes(lowercaseQuery)
    );
  }, [getAllHistory]);

  // Obter estatísticas do histórico
  const getHistoryStats = useCallback(() => {
    const allHistory = getAllHistory();
    const totalItems = allHistory.length;
    
    const typeStats = {
      text: allHistory.filter(item => item.type === 'text').length,
      image: allHistory.filter(item => item.type === 'image').length,
      video: allHistory.filter(item => item.type === 'video').length,
      analysis: allHistory.filter(item => item.type === 'analysis').length
    };

    const providerStats = allHistory.reduce((acc, item) => {
      acc[item.provider] = (acc[item.provider] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalCost = allHistory.reduce((sum, item) => sum + (item.metadata.cost || 0), 0);
    const totalTokens = allHistory.reduce((sum, item) => sum + (item.metadata.tokens || 0), 0);

    const recentActivity = allHistory.slice(0, 10);

    return {
      totalItems,
      typeStats,
      providerStats,
      totalCost,
      totalTokens,
      recentActivity
    };
  }, [getAllHistory]);

  // Obter conversas de chat
  const getChatSessions = useCallback((): AIChatSession[] => {
    return chatHistory.sort((a, b) => 
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [chatHistory]);

  // Obter conversa específica
  const getChatSession = useCallback((sessionId: string): AIChatSession | null => {
    return chatHistory.find(session => session.id === sessionId) || null;
  }, [chatHistory]);

  // Exportar histórico
  const exportHistory = useCallback((format: 'json' | 'csv' = 'json') => {
    const allHistory = getAllHistory();
    
    if (format === 'json') {
      const dataStr = JSON.stringify(allHistory, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-history-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === 'csv') {
      const headers = ['ID', 'Type', 'Provider', 'Model', 'Prompt', 'Result', 'Created At', 'Cost', 'Tokens'];
      const csvContent = [
        headers.join(','),
        ...allHistory.map(item => [
          item.id,
          item.type,
          item.provider,
          item.model,
          `"${item.prompt.replace(/"/g, '""')}"`,
          `"${item.result.replace(/"/g, '""')}"`,
          item.created_at,
          item.metadata.cost || 0,
          item.metadata.tokens || 0
        ].join(','))
      ].join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-history-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    }
    
    notify('success', 'Histórico exportado com sucesso!');
  }, [getAllHistory]);

  return {
    // Estado
    loading,
    error,
    filters,
    chatHistory,
    analysisHistory,
    
    // Ações
    loadHistory,
    applyFilters,
    clearFilters,
    exportHistory,
    
    // Utilitários
    getAllHistory,
    getHistoryByType,
    getHistoryByProvider,
    getHistoryByPeriod,
    searchHistory,
    getHistoryStats,
    getChatSessions,
    getChatSession,
    
    // Controle de erro
    clearError: () => setError(null)
  };
};
