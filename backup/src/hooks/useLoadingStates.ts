/**
 * Sistema de Estados de Loading - xWin Dash
 * Gerenciamento avançado de estados de carregamento
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
  stage?: string;
  error?: string | null;
  startTime?: number;
  estimatedTime?: number;
}

export interface UseLoadingStatesReturn {
  states: Record<string, LoadingState>;
  isLoading: (key?: string) => boolean;
  hasError: (key?: string) => boolean;
  getState: (key: string) => LoadingState;
  setLoading: (key: string, loading: boolean, message?: string) => void;
  setProgress: (key: string, progress: number, stage?: string) => void;
  setError: (key: string, error: string | null) => void;
  clearState: (key: string) => void;
  clearAll: () => void;
  withLoading: <T>(key: string, operation: () => Promise<T>, message?: string) => Promise<T>;
  getLoadingDuration: (key: string) => number;
  getEstimatedTimeRemaining: (key: string) => number | null;
}

const DEFAULT_STATE: LoadingState = {
  isLoading: false,
  progress: undefined,
  message: undefined,
  stage: undefined,
  error: null,
  startTime: undefined,
  estimatedTime: undefined,
};

export const useLoadingStates = (): UseLoadingStatesReturn => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});
  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    return () => {
      // Cleanup timers on unmount
      Object.values(timersRef.current).forEach(timer => clearTimeout(timer));
    };
  }, []);

  const getState = useCallback((key: string): LoadingState => {
    return states[key] || DEFAULT_STATE;
  }, [states]);

  const isLoading = useCallback((key?: string): boolean => {
    if (key) {
      return getState(key).isLoading;
    }
    return Object.values(states).some(state => state.isLoading);
  }, [states, getState]);

  const hasError = useCallback((key?: string): boolean => {
    if (key) {
      return !!getState(key).error;
    }
    return Object.values(states).some(state => !!state.error);
  }, [states, getState]);

  const setLoading = useCallback((
    key: string, 
    loading: boolean, 
    message?: string
  ) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key] || DEFAULT_STATE,
        isLoading: loading,
        message,
        error: loading ? null : prev[key]?.error || null,
        startTime: loading ? Date.now() : prev[key]?.startTime,
        progress: loading ? 0 : undefined,
        stage: loading ? undefined : prev[key]?.stage,
      }
    }));

    if (loading) {
      // Clear any existing timer
      if (timersRef.current[key]) {
        clearTimeout(timersRef.current[key]);
      }
    } else {
      // Auto-clear successful states after 2 seconds
      if (!getState(key).error) {
        timersRef.current[key] = setTimeout(() => {
          clearState(key);
        }, 2000);
      }
    }
  }, [getState]);

  const setProgress = useCallback((
    key: string, 
    progress: number, 
    stage?: string
  ) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key] || DEFAULT_STATE,
        progress: Math.max(0, Math.min(100, progress)),
        stage,
      }
    }));
  }, []);

  const setError = useCallback((key: string, error: string | null) => {
    setStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key] || DEFAULT_STATE,
        error,
        isLoading: false,
        progress: error ? undefined : prev[key]?.progress,
      }
    }));

    // Clear timer if setting error
    if (error && timersRef.current[key]) {
      clearTimeout(timersRef.current[key]);
      delete timersRef.current[key];
    }
  }, []);

  const clearState = useCallback((key: string) => {
    setStates(prev => {
      const newStates = { ...prev };
      delete newStates[key];
      return newStates;
    });

    if (timersRef.current[key]) {
      clearTimeout(timersRef.current[key]);
      delete timersRef.current[key];
    }
  }, []);

  const clearAll = useCallback(() => {
    setStates({});
    Object.values(timersRef.current).forEach(timer => clearTimeout(timer));
    timersRef.current = {};
  }, []);

  const withLoading = useCallback(async <T>(
    key: string,
    operation: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      setLoading(key, true, message);
      const result = await operation();
      setLoading(key, false);
      return result;
    } catch (error: any) {
      setError(key, error.message || 'Erro desconhecido');
      throw error;
    }
  }, [setLoading, setError]);

  const getLoadingDuration = useCallback((key: string): number => {
    const state = getState(key);
    if (!state.startTime) return 0;
    return Date.now() - state.startTime;
  }, [getState]);

  const getEstimatedTimeRemaining = useCallback((key: string): number | null => {
    const state = getState(key);
    if (!state.estimatedTime || !state.progress) return null;
    
    const elapsed = getLoadingDuration(key);
    const progressRatio = state.progress / 100;
    
    if (progressRatio <= 0) return state.estimatedTime;
    
    const estimatedTotal = elapsed / progressRatio;
    return Math.max(0, estimatedTotal - elapsed);
  }, [getState, getLoadingDuration]);

  return {
    states,
    isLoading,
    hasError,
    getState,
    setLoading,
    setProgress,
    setError,
    clearState,
    clearAll,
    withLoading,
    getLoadingDuration,
    getEstimatedTimeRemaining,
  };
};

// Hook especializado para formulários
export const useFormLoadingStates = () => {
  const loadingStates = useLoadingStates();

  const submitForm = useCallback(async <T>(
    formName: string,
    submitFn: () => Promise<T>,
    options?: {
      successMessage?: string;
      errorMessage?: string;
    }
  ): Promise<T | null> => {
    try {
      const result = await loadingStates.withLoading(
        `form-${formName}`,
        submitFn,
        'Enviando formulário...'
      );
      return result;
    } catch (error) {
      return null;
    }
  }, [loadingStates]);

  return {
    ...loadingStates,
    submitForm,
    isSubmitting: (formName: string) => loadingStates.isLoading(`form-${formName}`),
    getSubmissionError: (formName: string) => loadingStates.getState(`form-${formName}`).error,
  };
};

// Hook para operações de dados (CRUD)
export const useDataLoadingStates = () => {
  const loadingStates = useLoadingStates();

  const operations = {
    fetch: (key: string, fn: () => Promise<any>) => 
      loadingStates.withLoading(`fetch-${key}`, fn, 'Carregando dados...'),
    
    create: (key: string, fn: () => Promise<any>) => 
      loadingStates.withLoading(`create-${key}`, fn, 'Criando...'),
    
    update: (key: string, fn: () => Promise<any>) => 
      loadingStates.withLoading(`update-${key}`, fn, 'Atualizando...'),
    
    delete: (key: string, fn: () => Promise<any>) => 
      loadingStates.withLoading(`delete-${key}`, fn, 'Excluindo...'),
    
    export: (key: string, fn: () => Promise<any>) => 
      loadingStates.withLoading(`export-${key}`, fn, 'Exportando...'),
    
    import: (key: string, fn: () => Promise<any>) => 
      loadingStates.withLoading(`import-${key}`, fn, 'Importando...'),
  };

  const isOperationLoading = (operation: string, key: string) => 
    loadingStates.isLoading(`${operation}-${key}`);

  return {
    ...loadingStates,
    operations,
    isOperationLoading,
    isFetching: (key: string) => isOperationLoading('fetch', key),
    isCreating: (key: string) => isOperationLoading('create', key),
    isUpdating: (key: string) => isOperationLoading('update', key),
    isDeleting: (key: string) => isOperationLoading('delete', key),
    isExporting: (key: string) => isOperationLoading('export', key),
    isImporting: (key: string) => isOperationLoading('import', key),
  };
};

export default useLoadingStates;
