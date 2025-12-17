import { apiClient } from '@/services';
/**
 * Sistema de Estados de Loading - xWin Dash
 *
 * @description
 * Este módulo fornece hooks avançados para gerenciamento de estados de carregamento
 * em formulários, operações CRUD e outras operações assíncronas. Inclui tracking
 * de progresso, mensagens, estágios, erros e estimativas de tempo.
 *
 * Funcionalidades principais:
 * - Gerenciamento de múltiplos estados de loading simultâneos
 * - Tracking de progresso (0-100%)
 * - Mensagens e estágios de carregamento
 * - Gerenciamento de erros
 * - Estimativa de tempo restante
 * - Auto-limpeza de estados bem-sucedidos
 * - Hooks especializados (form loading, data operations)
 *
 * @module hooks/useLoadingStates
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * const loadingStates = useLoadingStates();

 *
 * // Em uma operação assíncrona
 * await loadingStates.withLoading('save', async () => {
 *   await saveData();

 * }, 'Salvando dados...');

 *
 * // Verificar estado
 * if (loadingStates.isLoading('save')) {
 * }
 * ```
 */

import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Interface de estado de loading
 *
 * @description
 * Define o estado completo de um processo de carregamento, incluindo
 * progresso, mensagens, estágios, erros e métricas de tempo.
 *
 * @example
 * ```ts
 * const state: LoadingState = {
 *   isLoading: true,
 *   progress: 50,
 *   message: 'Carregando...',
 *   stage: 'fetching',
 *   startTime: Date.now(),
 *   estimatedTime: 5000
 *};

 * ```
 */
export interface LoadingState {
  isLoading: boolean;
  progress?: number;
  message?: string;
  stage?: string;
  error?: string | null;
  startTime?: number;
  estimatedTime?: number; }

/**
 * Interface de retorno do hook useLoadingStates
 *
 * @description
 * Retorna estado e funções para gerenciamento de estados de loading.
 *
 * @example
 * ```tsx
 * const {
 *   states,
 *   isLoading,
 *   hasError,
 *   setLoading,
 *   withLoading
 * } = useLoadingStates();

 * ```
 */
export interface UseLoadingStatesReturn {
  states: Record<string, LoadingState>;
  isLoading: (key?: string) => boolean;
  hasError: (key?: string) => boolean;
  getState: (key: string) => LoadingState;
  setLoading?: (e: any) => void;
  setProgress?: (e: any) => void;
  setError?: (e: any) => void;
  clearState?: (e: any) => void;
  clearAll??: (e: any) => void;
  withLoading: <T>(
    key: string,
    operation: () => Promise<T>,
    message?: string,
  ) => Promise<T>;
  getLoadingDuration: (key: string) => number;
  getEstimatedTimeRemaining: (key: string) => number | null; }

/**
 * Estado padrão de loading
 *
 * @description
 * Estado inicial para novos processos de loading.
 *
 * @constant {LoadingState}
 */
const DEFAULT_STATE: LoadingState = {
  isLoading: false,
  progress: undefined,
  message: undefined,
  stage: undefined,
  error: null,
  startTime: undefined,
  estimatedTime: undefined,};

/**
 * Hook principal para gerenciamento de estados de loading
 *
 * @description
 * Hook que fornece gerenciamento completo de estados de carregamento para
 * múltiplas operações simultâneas. Inclui tracking de progresso, mensagens,
 * erros e métricas de tempo.
 *
 * @returns {UseLoadingStatesReturn} Objeto com estado e funções de gerenciamento
 *
 * @example
 * ```tsx
 * const loadingStates = useLoadingStates();

 *
 * // Executar operação com loading
 * await loadingStates.withLoading('save', async () => {
 *   await saveData();

 * }, 'Salvando dados...');

 *
 * // Verificar estado
 * if (loadingStates.isLoading('save')) {
 *   return <Spinner />;
 * }
 *
 * // Atualizar progresso
 * loadingStates.setProgress('save', 75, 'Almost done');

 * ```
 */
export const useLoadingStates = (): UseLoadingStatesReturn => {
  const [states, setStates] = useState<Record<string, LoadingState>>({});

  const timersRef = useRef<Record<string, NodeJS.Timeout>>({});

  useEffect(() => {
    return () => {
      // Cleanup timers on unmount
      Object.values(timersRef.current).forEach((timer: unknown) => clearTimeout(timer));};

  }, []);

  const getState = useCallback(
    (key: string): LoadingState => {
      return states[key] || DEFAULT_STATE;
    },
    [states],);

  const isLoading = useCallback(
    (key?: string): boolean => {
      if (key) {
        return getState(key).isLoading;
      }
      return Object.values(states).some((state: unknown) => state.isLoading);

    },
    [states, getState],);

  const hasError = useCallback(
    (key?: string): boolean => {
      if (key) {
        return !!getState(key).error;
      }
      return Object.values(states).some((state: unknown) => !!state.error);

    },
    [states, getState],);

  const setLoading = useCallback(
    (key: string, loading: boolean, message?: string) => {
      setStates((prev: unknown) => ({
        ...prev,
        [key]: {
          ...(prev[key] || DEFAULT_STATE),
          isLoading: loading,
          message,
          error: loading ? null : prev[key]?.error || null,
          startTime: loading ? Date.now() : prev[key]?.startTime,
          progress: loading ? 0 : undefined,
          stage: loading ? undefined : prev[key]?.stage,
        },
      }));

      if (loading) {
        // Clear any existing timer
        if (timersRef.current[key]) {
          clearTimeout(timersRef.current[key]);

        } else {
        // Auto-clear successful states after 2 seconds
        if (!getState(key).error) {
          timersRef.current[key] = setTimeout(() => {
            clearState(key);

          }, 2000);

        } },
    [getState],);

  const setProgress = useCallback(
    (key: string, progress: number, stage?: string) => {
      setStates((prev: unknown) => ({
        ...prev,
        [key]: {
          ...(prev[key] || DEFAULT_STATE),
          progress: Math.max(0, Math.min(100, progress)),
          stage,
        },
      }));

    },
    [],);

  const setError = useCallback((key: string, error: string | null) => {
    setStates((prev: unknown) => ({
      ...prev,
      [key]: {
        ...(prev[key] || DEFAULT_STATE),
        error,
        isLoading: false,
        progress: error ? undefined : prev[key]?.progress,
      },
    }));

    // Clear timer if setting error
    if (error && timersRef.current[key]) {
      clearTimeout(timersRef.current[key]);

      delete timersRef.current[key];
    } , []);

  const clearState = useCallback((key: string) => {
    setStates((prev: unknown) => {
      const newStates = { ...prev};

      delete newStates[key];
      return newStates;
    });

    if (timersRef.current[key]) {
      clearTimeout(timersRef.current[key]);

      delete timersRef.current[key];
    } , []);

  const clearAll = useCallback(() => {
    setStates({});

    Object.values(timersRef.current).forEach((timer: unknown) => clearTimeout(timer));

    timersRef.current = {};

  }, []);

  const withLoading = useCallback(
    async <T>(
      key: string,
      operation: () => Promise<T>,
      message?: string,
    ): Promise<T> => {
      try {
        setLoading(key, true, message);

        const result = await operation();

        setLoading(key, false);

        return result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? (error as any).message : "Erro desconhecido";
        setError(key, errorMessage);

        throw error;
      } ,
    [setLoading, setError],);

  const getLoadingDuration = useCallback(
    (key: string): number => {
      const state = getState(key);

      if (!state.startTime) return 0;
      return Date.now() - state.startTime;
    },
    [getState],);

  const getEstimatedTimeRemaining = useCallback(
    (key: string): number | null => {
      const state = getState(key);

      if (!state.estimatedTime || !state.progress) return null;

      const elapsed = getLoadingDuration(key);

      const progressRatio = state.progress / 100;

      if (progressRatio <= 0) return state.estimatedTime;

      const estimatedTotal = elapsed / progressRatio;
      return Math.max(0, estimatedTotal - elapsed);

    },
    [getState, getLoadingDuration],);

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
    getEstimatedTimeRemaining,};
};

/**
 * Hook especializado para estados de loading em formulários
 *
 * @description
 * Hook que estende useLoadingStates com funcionalidades específicas para
 * gerenciamento de estados de loading em formulários, incluindo submissão.
 *
 * @returns {UseLoadingStatesReturn & { submitForm: Function, isSubmitting: Function, getSubmissionError: Function } Objeto com funções adicionais de formulário
 *
 * @example
 * ```tsx
 * const formLoading = useFormLoadingStates();

 *
 * const handleSubmit = async (data: unknown) => {
 *   await formLoading.submitForm('user', async () => {
 *     await createUser(data);

 *   });

 *};

 *
 * if (formLoading.isSubmitting('user')) {
 *   return <Spinner />;
 * }
 * ```
 */
export const useFormLoadingStates = () => {
  const loadingStates = useLoadingStates();

  const submitForm = useCallback(
    async <T>(
      formName: string,
      submitFn: () => Promise<T>,
      options?: {
        successMessage?: string;
        errorMessage?: string;
      },
    ): Promise<T | null> => {
      try {
        const result = await loadingStates.withLoading(
          `form-${formName}`,
          submitFn,
          "Enviando formulário...",);

        return result;
      } catch (error) {
        return null;
      } ,
    [loadingStates],);

  return {
    ...loadingStates,
    submitForm,
    isSubmitting: (formName: string) =>
      loadingStates.isLoading(`form-${formName}`),
    getSubmissionError: (formName: string) =>
      loadingStates.getState(`form-${formName}`).error,};
};

/**
 * Hook para operações de dados (CRUD)
 *
 * @description
 * Hook que estende useLoadingStates com operações específicas para CRUD,
 * fornecendo helpers para fetch, create, update, delete, export e import.
 *
 * @returns {UseLoadingStatesReturn & { operations: Object, isOperationLoading: Function, isFetching: Function, isCreating: Function, isUpdating: Function, isDeleting: Function, isExporting: Function, isImporting: Function } Objeto com operações CRUD e funções de verificação
 *
 * @example
 * ```tsx
 * const dataLoading = useDataLoadingStates();

 *
 * // Executar operações CRUD
 * await dataLoading.operations.apiClient.get('users', async () => {
 *   return await getUsers();

 * });

 *
 * await dataLoading.operations.create('user', async () => {
 *   return await createUser(userData);

 * });

 *
 * // Verificar estados
 * if (dataLoading.isFetching('users')) {
 *   return <Spinner />;
 * }
 * ```
 */
export const useDataLoadingStates = () => {
  const loadingStates = useLoadingStates();

  /**
   * Operações CRUD com estados de loading automáticos
   *
   * @description
   * Objeto com métodos para operações CRUD que gerenciam automaticamente
   * os estados de loading durante a execução.
   */
  const operations = {
    /**
     * Executa uma operação de fetch com loading automático
     *
     * @param {string} key - Chave identificadora da operação
     * @param {() => Promise<any>} fn - Função assíncrona a ser executada
     * @returns {Promise<any>} Resultado da operação
     */
    fetch: (key: string, fn: () => Promise<any>) =>
      loadingStates.withLoading(`fetch-${key}`, fn, "Carregando dados..."),

    /**
     * Executa uma operação de create com loading automático
     *
     * @param {string} key - Chave identificadora da operação
     * @param {() => Promise<any>} fn - Função assíncrona a ser executada
     * @returns {Promise<any>} Resultado da operação
     */
    create: (key: string, fn: () => Promise<any>) =>
      loadingStates.withLoading(`create-${key}`, fn, "Criando..."),

    /**
     * Executa uma operação de update com loading automático
     *
     * @param {string} key - Chave identificadora da operação
     * @param {() => Promise<any>} fn - Função assíncrona a ser executada
     * @returns {Promise<any>} Resultado da operação
     */
    update: (key: string, fn: () => Promise<any>) =>
      loadingStates.withLoading(`update-${key}`, fn, "Atualizando..."),

    /**
     * Executa uma operação de delete com loading automático
     *
     * @param {string} key - Chave identificadora da operação
     * @param {() => Promise<any>} fn - Função assíncrona a ser executada
     * @returns {Promise<any>} Resultado da operação
     */
    delete: (key: string, fn: () => Promise<any>) =>
      loadingStates.withLoading(`delete-${key}`, fn, "Excluindo..."),

    /**
     * Executa uma operação de export com loading automático
     *
     * @param {string} key - Chave identificadora da operação
     * @param {() => Promise<any>} fn - Função assíncrona a ser executada
     * @returns {Promise<any>} Resultado da operação
     */
    export: (key: string, fn: () => Promise<any>) =>
      loadingStates.withLoading(`export-${key}`, fn, "Exportando..."),

    /**
     * Executa uma operação de import com loading automático
     *
     * @param {string} key - Chave identificadora da operação
     * @param {() => Promise<any>} fn - Função assíncrona a ser executada
     * @returns {Promise<any>} Resultado da operação
     */
    import: (key: string, fn: () => Promise<any>) =>
      loadingStates.withLoading(`import-${key}`, fn, "Importando..."),};

  const isOperationLoading = (operation: string, key: string) =>
    loadingStates.isLoading(`${operation}-${key}`);

  return {
    ...loadingStates,
    operations,
    isOperationLoading,
    isFetching: (key: string) => isOperationLoading("fetch", key),
    isCreating: (key: string) => isOperationLoading("create", key),
    isUpdating: (key: string) => isOperationLoading("update", key),
    isDeleting: (key: string) => isOperationLoading("delete", key),
    isExporting: (key: string) => isOperationLoading("export", key),
    isImporting: (key: string) => isOperationLoading("import", key),};
};

export default useLoadingStates;
