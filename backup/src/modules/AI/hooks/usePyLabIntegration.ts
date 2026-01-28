/**
 * 🚀 PyLab Integration Hook
 * 
 * Hook personalizado para gerenciar a integração com PyLab
 * Fornece estado e métodos para interagir com o PyLab
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  pylabIntegrationService,
  PyLabCapabilities,
  PyLabSystemStatus,
  PyLabGenerationRequest,
  PyLabGenerationResponse,
  PyLabProgressResponse,
  PyLabTextAnalysisRequest,
  PyLabTextAnalysisResponse,
  PyLabImageAnalysisRequest,
  PyLabImageAnalysisResponse,
  PyLabCodeGenerationRequest,
  PyLabCodeGenerationResponse
} from '../services/pylabIntegrationService';

// ============================================================================
// TYPES
// ============================================================================

export interface PyLabConnectionStatus {
  status: 'disconnected' | 'connecting' | 'connected' | 'error';
  lastChecked: Date | null;
  error?: string;
}

export interface PyLabGenerationTask {
  id: string;
  type: 'image' | 'video' | 'text' | 'code';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  error?: string;
  startTime: Date;
  endTime?: Date;
  metadata?: Record<string, any>;
}

export interface PyLabIntegrationState {
  connection: PyLabConnectionStatus;
  capabilities: PyLabCapabilities | null;
  systemStatus: PyLabSystemStatus | null;
  generationTasks: PyLabGenerationTask[];
  isGenerating: boolean;
  selectedModel: string;
  lastError: string | null;
}

export interface PyLabIntegrationActions {
  // Connection
  checkConnection: () => Promise<boolean>;
  reconnect: () => Promise<void>;
  
  // System
  refreshSystemStatus: () => Promise<void>;
  refreshCapabilities: () => Promise<void>;
  
  // Generation
  generateImage: (request: PyLabGenerationRequest) => Promise<string>;
  generateVideo: (request: PyLabGenerationRequest) => Promise<string>;
  cancelGeneration: (taskId: string) => Promise<void>;
  
  // Analysis
  analyzeText: (request: PyLabTextAnalysisRequest) => Promise<PyLabTextAnalysisResponse>;
  analyzeImage: (request: PyLabImageAnalysisRequest) => Promise<PyLabImageAnalysisResponse>;
  generateCode: (request: PyLabCodeGenerationRequest) => Promise<PyLabCodeGenerationResponse>;
  
  // Tasks
  getTask: (taskId: string) => PyLabGenerationTask | undefined;
  clearCompletedTasks: () => void;
  clearAllTasks: () => void;
  
  // Utils
  setSelectedModel: (model: string) => void;
  clearError: () => void;
}

export type PyLabIntegrationHook = PyLabIntegrationState & PyLabIntegrationActions;

// ============================================================================
// HOOK
// ============================================================================

export const usePyLabIntegration = (): PyLabIntegrationHook => {
  // ============================================================================
  // STATE
  // ============================================================================
  
  const [connection, setConnection] = useState<PyLabConnectionStatus>({
    status: 'disconnected',
    lastChecked: null
  });
  
  const [capabilities, setCapabilities] = useState<PyLabCapabilities | null>(null);
  const [systemStatus, setSystemStatus] = useState<PyLabSystemStatus | null>(null);
  const [generationTasks, setGenerationTasks] = useState<PyLabGenerationTask[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [lastError, setLastError] = useState<string | null>(null);
  
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
  // CONNECTION METHODS
  // ============================================================================

  const checkConnection = useCallback(async (): Promise<boolean> => {
    setConnection(prev => ({ ...prev, status: 'connecting' }));
    
    try {
      const isConnected = await pylabIntegrationService.checkConnection();
      setConnection({
        status: isConnected ? 'connected' : 'error',
        lastChecked: new Date(),
        error: isConnected ? undefined : 'Falha na conexão'
      });
      
      if (isConnected) {
        setLastError(null);
      }
      
      return isConnected;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setConnection({
        status: 'error',
        lastChecked: new Date(),
        error: errorMessage
      });
      setLastError(errorMessage);
      return false;
    }
  }, []);

  const reconnect = useCallback(async (): Promise<void> => {
    await checkConnection();
  }, [checkConnection]);

  // ============================================================================
  // SYSTEM METHODS
  // ============================================================================

  const refreshSystemStatus = useCallback(async (): Promise<void> => {
    if (connection.status !== 'connected') return;
    
    try {
      const status = await pylabIntegrationService.getSystemStatus();
      setSystemStatus(status);
      setLastError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar status';
      setLastError(errorMessage);
      console.error('Erro ao carregar status do sistema:', error);
    }
  }, [connection.status]);

  const refreshCapabilities = useCallback(async (): Promise<void> => {
    if (connection.status !== 'connected') return;
    
    try {
      const caps = await pylabIntegrationService.getCapabilities();
      setCapabilities(caps);
      setLastError(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar capacidades';
      setLastError(errorMessage);
      console.error('Erro ao carregar capacidades:', error);
    }
  }, [connection.status]);

  const loadCapabilities = useCallback(async (): Promise<void> => {
    await refreshCapabilities();
  }, [refreshCapabilities]);

  // ============================================================================
  // POLLING METHODS
  // ============================================================================

  const startStatusPolling = useCallback(() => {
    const poll = async () => {
      await refreshSystemStatus();
      statusPollingRef.current = setTimeout(poll, 30000); // Poll a cada 30 segundos
    };
    poll();
  }, [refreshSystemStatus]);

  const stopStatusPolling = useCallback(() => {
    if (statusPollingRef.current) {
      clearTimeout(statusPollingRef.current);
      statusPollingRef.current = null;
    }
  }, []);

  const startTaskPolling = useCallback((taskId: string) => {
    const poll = async () => {
      try {
        const progress = await pylabIntegrationService.getGenerationProgress(taskId);
        
        setGenerationTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                progress: progress.progress_percent,
                status: progress.status as any,
                metadata: { ...task.metadata, message: progress.message }
              }
            : task
        ));

        if (progress.status === 'completed') {
          const finalStatus = await pylabIntegrationService.getGenerationStatus(taskId);
          setGenerationTasks(prev => prev.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status: 'completed', 
                  progress: 100, 
                  result: finalStatus, 
                  endTime: new Date() 
                }
              : task
          ));
          setIsGenerating(false);
          stopTaskPolling(taskId);
        } else if (progress.status === 'failed') {
          setGenerationTasks(prev => prev.map(task => 
            task.id === taskId 
              ? { 
                  ...task, 
                  status: 'failed', 
                  error: 'Geração falhou', 
                  endTime: new Date() 
                }
              : task
          ));
          setIsGenerating(false);
          stopTaskPolling(taskId);
        } else {
          // Continuar polling
          const timeoutId = setTimeout(poll, 2000);
          pollingRefs.current.set(taskId, timeoutId);
        }
      } catch (error) {
        console.error('Erro ao verificar progresso da tarefa:', error);
        setGenerationTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                status: 'failed', 
                error: 'Erro ao verificar progresso', 
                endTime: new Date() 
              }
            : task
        ));
        setIsGenerating(false);
        stopTaskPolling(taskId);
      }
    };

    // Iniciar polling imediatamente
    poll();
  }, []);

  const stopTaskPolling = useCallback((taskId: string) => {
    const timeoutId = pollingRefs.current.get(taskId);
    if (timeoutId) {
      clearTimeout(timeoutId);
      pollingRefs.current.delete(taskId);
    }
  }, []);

  // ============================================================================
  // GENERATION METHODS
  // ============================================================================

  const generateImage = useCallback(async (request: PyLabGenerationRequest): Promise<string> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    setIsGenerating(true);
    const taskId = `img_${Date.now()}`;
    
    const task: PyLabGenerationTask = {
      id: taskId,
      type: 'image',
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      metadata: { request }
    };

    setGenerationTasks(prev => [...prev, task]);

    try {
      const response = await pylabIntegrationService.generateImage(request);
      
      // Atualizar task com ID real do PyLab
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, id: response.task_id, status: 'processing', progress: 10 }
          : t
      ));

      // Iniciar polling
      startTaskPolling(response.task_id);
      
      return response.task_id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na geração de imagem';
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', error: errorMessage, endTime: new Date() }
          : t
      ));
      setIsGenerating(false);
      setLastError(errorMessage);
      throw error;
    }
  }, [connection.status, startTaskPolling]);

  const generateVideo = useCallback(async (request: PyLabGenerationRequest): Promise<string> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    setIsGenerating(true);
    const taskId = `vid_${Date.now()}`;
    
    const task: PyLabGenerationTask = {
      id: taskId,
      type: 'video',
      status: 'pending',
      progress: 0,
      startTime: new Date(),
      metadata: { request }
    };

    setGenerationTasks(prev => [...prev, task]);

    try {
      const response = await pylabIntegrationService.generateVideo(request);
      
      // Atualizar task com ID real do PyLab
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, id: response.task_id, status: 'processing', progress: 5 }
          : t
      ));

      // Iniciar polling (vídeos demoram mais)
      startTaskPolling(response.task_id);
      
      return response.task_id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na geração de vídeo';
      setGenerationTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, status: 'failed', error: errorMessage, endTime: new Date() }
          : t
      ));
      setIsGenerating(false);
      setLastError(errorMessage);
      throw error;
    }
  }, [connection.status, startTaskPolling]);

  const cancelGeneration = useCallback(async (taskId: string): Promise<void> => {
    try {
      await pylabIntegrationService.cancelGeneration(taskId);
      
      setGenerationTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: 'cancelled', endTime: new Date() }
          : task
      ));
      
      stopTaskPolling(taskId);
      setIsGenerating(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao cancelar geração';
      setLastError(errorMessage);
      throw error;
    }
  }, [stopTaskPolling]);

  // ============================================================================
  // ANALYSIS METHODS
  // ============================================================================

  const analyzeText = useCallback(async (request: PyLabTextAnalysisRequest): Promise<PyLabTextAnalysisResponse> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    try {
      const response = await pylabIntegrationService.analyzeText(request);
      setLastError(null);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na análise de texto';
      setLastError(errorMessage);
      throw error;
    }
  }, [connection.status]);

  const analyzeImage = useCallback(async (request: PyLabImageAnalysisRequest): Promise<PyLabImageAnalysisResponse> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    try {
      const response = await pylabIntegrationService.analyzeImage(request);
      setLastError(null);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na análise de imagem';
      setLastError(errorMessage);
      throw error;
    }
  }, [connection.status]);

  const generateCode = useCallback(async (request: PyLabCodeGenerationRequest): Promise<PyLabCodeGenerationResponse> => {
    if (connection.status !== 'connected') {
      throw new Error('PyLab não está conectado');
    }

    try {
      const response = await pylabIntegrationService.generateCode(request);
      setLastError(null);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro na geração de código';
      setLastError(errorMessage);
      throw error;
    }
  }, [connection.status]);

  // ============================================================================
  // TASK MANAGEMENT
  // ============================================================================

  const getTask = useCallback((taskId: string): PyLabGenerationTask | undefined => {
    return generationTasks.find(task => task.id === taskId);
  }, [generationTasks]);

  const clearCompletedTasks = useCallback(() => {
    setGenerationTasks(prev => prev.filter(task => 
      task.status !== 'completed' && task.status !== 'failed' && task.status !== 'cancelled'
    ));
  }, []);

  const clearAllTasks = useCallback(() => {
    // Parar todos os polling
    pollingRefs.current.forEach(clearTimeout);
    pollingRefs.current.clear();
    
    setGenerationTasks([]);
    setIsGenerating(false);
  }, []);

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  const clearError = useCallback(() => {
    setLastError(null);
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    connection,
    capabilities,
    systemStatus,
    generationTasks,
    isGenerating,
    selectedModel,
    lastError,
    
    // Actions
    checkConnection,
    reconnect,
    refreshSystemStatus,
    refreshCapabilities,
    generateImage,
    generateVideo,
    cancelGeneration,
    analyzeText,
    analyzeImage,
    generateCode,
    getTask,
    clearCompletedTasks,
    clearAllTasks,
    setSelectedModel,
    clearError
  };
};

export default usePyLabIntegration;