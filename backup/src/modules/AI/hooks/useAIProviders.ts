/**
 * Hook especializado para gerenciamento de provedores AI
 * Gerencia status, configuração e seleção de provedores
 */
import { useCallback, useState, useEffect } from 'react';
import { useAIStore } from './useAIStore';
import { AIProvider, AIProviders, AIServicesStatus } from '../types';
import { getProviderConfig, getProviderModels, providerSupportsType, getBestModel } from '../types/aiProviders';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

export const useAIProviders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();
  
  const {
    providers,
    providersLoading,
    servicesStatus,
    servicesLoading,
    fetchProviders,
    fetchServicesStatus
  } = useAIStore();

  // Carregar provedores na inicialização
  useEffect(() => {
    if (Object.keys(providers).length === 0) {
      loadProviders();
    }
  }, []);

  // Carregar status dos serviços na inicialização
  useEffect(() => {
    if (!servicesStatus) {
      loadServicesStatus();
    }
  }, []);

  // Carregar provedores
  const loadProviders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchProviders();
      showSuccess('Provedores carregados com sucesso!');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar provedores';
      setError(errorMessage);
      showError('Erro ao carregar provedores', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchProviders]);

  // Carregar status dos serviços
  const loadServicesStatus = useCallback(async () => {
    try {
      await fetchServicesStatus();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar status dos serviços';
      setError(errorMessage);
      showError('Erro ao carregar provedores', errorMessage);
    }
  }, [fetchServicesStatus]);

  // Verificar se um provedor está disponível
  const isProviderAvailable = useCallback((provider: AIProvider): boolean => {
    const providerData = providers[provider];
    return providerData?.status === 'active' && providerData?.api_key_configured;
  }, [providers]);

  // Obter provedores disponíveis
  const getAvailableProviders = useCallback((): AIProvider[] => {
    return Object.keys(providers).filter(provider => 
      isProviderAvailable(provider as AIProvider)
    ) as AIProvider[];
  }, [providers, isProviderAvailable]);

  // Obter provedores por tipo de geração
  const getProvidersByType = useCallback((type: 'text' | 'image' | 'video' | 'code'): AIProvider[] => {
    return Object.keys(providers).filter(provider => {
      const providerData = providers[provider];
      return providerData?.capabilities.includes(type) && isProviderAvailable(provider as AIProvider);
    }) as AIProvider[];
  }, [providers, isProviderAvailable]);

  // Obter melhor provedor para um tipo
  const getBestProvider = useCallback((type: 'text' | 'image' | 'video' | 'code'): AIProvider | null => {
    const availableProviders = getProvidersByType(type);
    if (availableProviders.length === 0) return null;

    // Prioridade: Claude > OpenAI > Gemini para texto
    if (type === 'text') {
      if (availableProviders.includes('claude')) return 'claude';
      if (availableProviders.includes('openai')) return 'openai';
      if (availableProviders.includes('gemini')) return 'gemini';
    }

    // Para outros tipos, retorna o primeiro disponível
    return availableProviders[0];
  }, [getProvidersByType]);

  // Obter configuração de um provedor
  const getProviderInfo = useCallback((provider: AIProvider) => {
    return {
      config: getProviderConfig(provider),
      data: providers[provider],
      models: getProviderModels(provider),
      isAvailable: isProviderAvailable(provider),
      supportsType: (type: 'text' | 'image' | 'video' | 'code') => providerSupportsType(provider, type),
      bestModel: (type: 'text' | 'image' | 'video' | 'code') => getBestModel(provider, type)
    };
  }, [providers, isProviderAvailable]);

  // Obter estatísticas dos provedores
  const getProvidersStats = useCallback(() => {
    const totalProviders = Object.keys(providers).length;
    const availableProviders = getAvailableProviders().length;
    const configuredProviders = Object.values(providers).filter(p => p.api_key_configured).length;
    
    const typeStats = {
      text: getProvidersByType('text').length,
      image: getProvidersByType('image').length,
      video: getProvidersByType('video').length,
      code: getProvidersByType('code').length
    };

    return {
      totalProviders,
      availableProviders,
      configuredProviders,
      typeStats
    };
  }, [providers, getAvailableProviders, getProvidersByType]);

  // Verificar status de um serviço específico
  const getServiceStatus = useCallback((serviceName: string) => {
    return servicesStatus?.[serviceName] || null;
  }, [servicesStatus]);

  // Obter todos os status dos serviços
  const getAllServicesStatus = useCallback(() => {
    return servicesStatus || {};
  }, [servicesStatus]);

  return {
    // Estado
    loading: loading || providersLoading || servicesLoading,
    error,
    providers,
    servicesStatus,
    
    // Ações
    loadProviders,
    loadServicesStatus,
    
    // Utilitários
    isProviderAvailable,
    getAvailableProviders,
    getProvidersByType,
    getBestProvider,
    getProviderInfo,
    getProvidersStats,
    getServiceStatus,
    getAllServicesStatus,
    
    // Controle de erro
    clearError: () => setError(null)
  };
};
