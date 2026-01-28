/**
 * 🤖 AI Laboratory Hook
 * 
 * Hook personalizado para gerenciar o estado e operações do bloco aiLaboratory
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { aiLaboratoryApi } from '../services/aiLaboratoryApi';
import { 
  AIGenerationRequest, 
  AIGenerationResult, 
  PyLabConnectionStatus, 
  PyLabCapabilities, 
  PyLabSystemStatus,
  AILaboratoryBlockData,
  AILaboratoryError,
  DEFAULT_AI_CONFIG,
  DEFAULT_GENERATION_CONFIG
} from '../types';

// ============================================================================
// HOOK INTERFACE
// ============================================================================

export interface UseAILaboratoryReturn {
  // State
  status: 'idle' | 'loading' | 'connected' | 'error';
  connection: PyLabConnectionStatus;
  capabilities: PyLabCapabilities | null;
  systemStatus: PyLabSystemStatus | null;
  generations: AIGenerationResult[];
  activeGenerations: string[];
  error: AILaboratoryError | null;
  
  // Actions
  checkConnection: () => Promise<void>;
  generate: (request: AIGenerationRequest) => Promise<AIGenerationResult>;
  cancelGeneration: (taskId: string) => Promise<void>;
  getGenerationStatus: (taskId: string) => Promise<AIGenerationResult>;
  uploadImage: (file: File) => Promise<AIGenerationResult>;
  clearError: () => void;
  clearHistory: () => void;
  
  // Settings
  updateSettings: (settings: Partial<AILaboratoryBlockData>) => void;
  getSettings: () => AILaboratoryBlockData;
  
  // Metrics
  getMetrics: () => {
    totalGenerations: number;
    successRate: number;
    averageTime: number;
    activeTasks: number;
  };
}

// ============================================================================
// HOOK IMPLEMENTATION
// ============================================================================

export const useAILaboratory = (): UseAILaboratoryReturn => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'connected' | 'error'>('idle');
  const [connection, setConnection] = useState<PyLabConnectionStatus>({
    status: 'disconnected',
    lastChecked: null
  });
  const [capabilities, setCapabilities] = useState<PyLabCapabilities | null>(null);
  const [systemStatus, setSystemStatus] = useState<PyLabSystemStatus | null>(null);
  const [generations, setGenerations] = useState<AIGenerationResult[]>([]);
  const [activeGenerations, setActiveGenerations] = useState<string[]>([]);
  const [error, setError] = useState<AILaboratoryError | null>(null);
  
  // Refs para polling
  const pollingRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const statusPollingRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Verificar conexão inicial
    checkConnection();
    
    // Cleanup polling ao desmontar
    return () => {
      pollingRefs.current.forEach(clearTimeout);
      if (statusPollingRef.current) {
        clearTimeout(statusPollingRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Iniciar polling de status quando conectado
    if (connection.status === 'connected') {
      startStatusPolling();
      loadCapabilities();
    } else {
      stopStatusPolling();
    }
    
    return () => stopStatusPolling();
  }, [connection.status]);

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  const checkConnection = useCallback(async (): Promise<void> => {
    setStatus('loading');
    try {
      const connectionStatus = await aiLaboratoryApi.checkPyLabConnection();
      setConnection(connectionStatus);
      setStatus(connectionStatus.status === 'connected' ? 'connected' : 'error');
      setError(null);
    } catch (err) {
      setError(err as AILaboratoryError);
      setStatus('error');
    }
  }, []);

  const loadCapabilities = useCallback(async (): Promise<void> => {
    if (connection.status !== 'connected') return;
    
    try {
      const caps = await aiLaboratoryApi.getPyLabCapabilities();
      setCapabilities(caps);
    } catch (err) {
      console.error('Erro ao carregar capacidades:', err);
    }
  }, [connection.status]);

  const loadSystemStatus = useCallback(async (): Promise<void> => {
    if (connection.status !== 'connected') return;
    
    try {
      const status = await aiLaboratoryApi.getPyLabSystemStatus();
      setSystemStatus(status);
    } catch (err) {
      console.error('Erro ao carregar status do sistema:', err);
    }
  }, [connection.status]);

  // ============================================================================
  // POLLING METHODS
  // ============================================================================

  const startStatusPolling = useCallback(() => {
    const poll = async () => {
      await loadSystemStatus();
      statusPollingRef.current = setTimeout(poll, 30000); // Poll a cada 30 segundos
    };
    poll();
  }, [loadSystemStatus]);

  const stopStatusPolling = useCallback(() => {
    if (statusPollingRef.current) {
      clearTimeout(statusPollingRef.current);
      statusPollingRef.current = null;
    }
  }, []);

  const startGenerationPolling = useCallback((taskId: string) => {
    const poll = async () => {
      try {
        const progress = await aiLaboratoryApi.getGenerationProgress(taskId);
        
        setGenerations(prev => prev.map(gen => 
          gen.id === taskId 
            ? { 
                ...gen, 
                progress: progress.progress,
                status: progress.status as any,
                metadata: { ...gen.metadata, message: progress.message }
              }
            : gen
        ));

        if (progress.status === 'completed') {
          const finalStatus = await aiLaboratoryApi.getGenerationStatus(taskId);
          setGenerations(prev => prev.map(gen => 
            gen.id === taskId 
              ? { 
                  ...gen, 
                  status: 'completed', 
                  progress: 100, 
                  result: finalStatus.result, 
                  endTime: new Date(),
                  file_url: finalStatus.file_url,
                  file_size: finalStatus.file_size,
                  generation_time: finalStatus.generation_time
                }
              : gen
          ));
          setActiveGenerations(prev => prev.filter(id => id !== taskId));
          stopGenerationPolling(taskId);
        } else if (progress.status === 'failed') {
          setGenerations(prev => prev.map(gen => 
            gen.id === taskId 
              ? { 
                  ...gen, 
                  status: 'failed', 
                  error: 'Geração falhou', 
                  endTime: new Date() 
                }
              : gen
          ));
          setActiveGenerations(prev => prev.filter(id => id !== taskId));
          stopGenerationPolling(taskId);
        } else {
          // Continuar polling
          const timeoutId = setTimeout(poll, 2000);
          pollingRefs.current.set(taskId, timeoutId);
        }
      } catch (err) {
        console.error('Erro ao verificar progresso da geração:', err);
        setGenerations(prev => prev.map(gen => 
          gen.id === taskId 
            ? { 
                ...gen, 
                status: 'failed', 
                error: 'Erro ao verificar progresso', 
                endTime: new Date() 
              }
            : gen
        ));
        setActiveGenerations(prev => prev.filter(id => id !== taskId));
        stopGenerationPolling(taskId);
      }
    };

    // Iniciar polling imediatamente
    poll();
  }, []);

  const stopGenerationPolling = useCallback((taskId: string) => {
    const timeoutId = pollingRefs.current.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      pollingRefs.current.delete(taskId);
    }
  }, []);

  // ============================================================================
  // GENERATION METHODS
  // ============================================================================

  const generate = useCallback(async (request: AIGenerationRequest): Promise<AIGenerationResult> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    try {
      const result = await aiLaboratoryApi.generate(request);
      
      // Adicionar à lista de gerações
      setGenerations(prev => [result, ...prev]);
      
      // Se for uma geração assíncrona (imagem/vídeo), iniciar polling
      if (result.status === 'processing') {
        setActiveGenerations(prev => [...prev, result.id]);
        startGenerationPolling(result.id);
      }
      
      setError(null);
      return result;
    } catch (err) {
      const error = err as AILaboratoryError;
      setError(error);
      throw error;
    }
  }, [connection.status, startGenerationPolling]);

  const cancelGeneration = useCallback(async (taskId: string): Promise<void> => {
    try {
      await aiLaboratoryApi.cancelGeneration(taskId);
      
      setGenerations(prev => prev.map(gen => 
        gen.id === taskId 
          ? { ...gen, status: 'cancelled', endTime: new Date() }
          : gen
      ));
      
      setActiveGenerations(prev => prev.filter(id => id !== taskId));
      stopGenerationPolling(taskId);
    } catch (err) {
      const error = err as AILaboratoryError;
      setError(error);
      throw error;
    }
  }, [stopGenerationPolling]);

  const getGenerationStatus = useCallback(async (taskId: string): Promise<AIGenerationResult> => {
    try {
      const result = await aiLaboratoryApi.getGenerationStatus(taskId);
      
      // Atualizar na lista de gerações
      setGenerations(prev => prev.map(gen => 
        gen.id === taskId ? result : gen
      ));
      
      return result;
    } catch (err) {
      const error = err as AILaboratoryError;
      setError(error);
      throw error;
    }
  }, []);

  const uploadImage = useCallback(async (file: File): Promise<AIGenerationResult> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    try {
      const result = await aiLaboratoryApi.uploadImage(file);
      
      // Adicionar à lista de gerações
      setGenerations(prev => [result, ...prev]);
      
      setError(null);
      return result;
    } catch (err) {
      const error = err as AILaboratoryError;
      setError(error);
      throw error;
    }
  }, [connection.status]);

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearHistory = useCallback(() => {
    setGenerations([]);
    setActiveGenerations([]);
  }, []);

  const updateSettings = useCallback((settings: Partial<AILaboratoryBlockData>) => {
    // Implementar atualização de configurações
    console.log('Atualizando configurações:', settings);
  }, []);

  const getSettings = useCallback((): AILaboratoryBlockData => {
    return {
      label: 'AI Laboratory',
      description: 'Laboratório de IA integrado com PyLab',
      status: connection.status === 'connected' ? 'active' : 'inactive',
      progress: 0,
      lastActivity: new Date().toISOString(),
      
      // AI Configuration
      provider: DEFAULT_AI_CONFIG.provider,
      model: DEFAULT_AI_CONFIG.model,
      temperature: DEFAULT_AI_CONFIG.temperature,
      maxTokens: DEFAULT_AI_CONFIG.maxTokens,
      
      // PyLab Integration
      pylabConnected: connection.status === 'connected',
      pylabCapabilities: capabilities,
      pylabSystemStatus: systemStatus,
      
      // Generation History
      generations: generations,
      activeGenerations: activeGenerations,
      
      // Settings
      autoSave: DEFAULT_AI_CONFIG.autoSave,
      notifications: DEFAULT_AI_CONFIG.notifications,
      maxHistory: DEFAULT_AI_CONFIG.maxHistory,
      
      // Metrics
      totalGenerations: generations.length,
      successRate: generations.length > 0 ? 
        (generations.filter(g => g.status === 'completed').length / generations.length) * 100 : 0,
      averageTime: generations.length > 0 ? 
        generations
          .filter(g => g.generation_time)
          .reduce((acc, g) => acc + (g.generation_time || 0), 0) / generations.length : 0,
      lastGeneration: generations.length > 0 ? generations[0].startTime : undefined
    };
  }, [connection, capabilities, systemStatus, generations, activeGenerations]);

  const getMetrics = useCallback(() => {
    return {
      totalGenerations: generations.length,
      successRate: generations.length > 0 ? 
        (generations.filter(g => g.status === 'completed').length / generations.length) * 100 : 0,
      averageTime: generations.length > 0 ? 
        generations
          .filter(g => g.generation_time)
          .reduce((acc, g) => acc + (g.generation_time || 0), 0) / generations.length : 0,
      activeTasks: activeGenerations.length
    };
  }, [generations, activeGenerations]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    status,
    connection,
    capabilities,
    systemStatus,
    generations,
    activeGenerations,
    error,
    
    // Actions
    checkConnection,
    generate,
    cancelGeneration,
    getGenerationStatus,
    uploadImage,
    clearError,
    clearHistory,
    
    // Settings
    updateSettings,
    getSettings,
    
    // Metrics
    getMetrics
  };
};

export default useAILaboratory;
