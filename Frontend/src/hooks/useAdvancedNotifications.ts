/**
 * Hook useAdvancedNotifications - Sistema Avançado de Notificações
 *
 * @description
 * Sistema completo de gerenciamento de notificações com suporte a múltiplos
 * tipos (success, error, warning, info, loading), ações customizadas, progresso,
 * persistência e operações assíncronas. Fornece hooks para exibir e gerenciar
 * notificações de forma centralizada.
 *
 * Funcionalidades principais:
 * - Múltiplos tipos de notificação (success, error, warning, info, loading)
 * - Ações customizadas por notificação
 * - Indicador de progresso
 * - Persistência configurável
 * - Auto-remoção com duração configurável
 * - Operações assíncronas com feedback
 * - Presets pré-configurados para cenários comuns
 *
 * @module hooks/useAdvancedNotifications
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
 *
 * const { showSuccess, showError, showLoading } = useAdvancedNotifications();

 *
 * // Notificação simples
 * showSuccess('Operação concluída', 'Os dados foram salvos com sucesso');

 *
 * // Notificação com ação
 * showError('Erro ao salvar', 'Tente novamente', 5000, [
 *   { label: 'Tentar Novamente', action: () => retry() }
 * ]);

 * ```
 */

import { useState, useCallback, useEffect } from 'react';
import { getErrorMessage } from '@/utils/errorHelpers';
import { useT } from './useTranslation';

export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info" | "loading";
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  progress?: number;
  timestamp: number; }

export interface NotificationAction {
  label: string;
  action??: (e: any) => void;
  variant?: "primary" | "secondary" | "destructive"; }

export interface UseNotificationsReturn {
  notifications: Notification[];
  showNotification: (
    notification: Omit<Notification, "id" | "timestamp">,
  ) => string;
  showSuccess: (title: string, message?: string, duration?: number) => string;
  showError: (title: string, message?: string, duration?: number) => string;
  showWarning: (title: string, message?: string, duration?: number) => string;
  showInfo: (title: string, message?: string, duration?: number) => string;
  showLoading: (title: string, message?: string) => string;
  updateNotification?: (e: any) => void;
  removeNotification?: (e: any) => void;
  clearAll??: (e: any) => void;
  clearByType?: (e: any) => void; }

/**
 * Contador global para IDs únicos de notificações
 *
 * @private
 * @type {number}
 */
let notificationCounter = 0;

/**
 * Gera um ID único para uma notificação
 *
 * @private
 * @returns {string} ID único no formato `notification-{timestamp}-{counter}`
 */
const generateId = (): string =>
  `notification-${Date.now()}-${++notificationCounter}`;

/**
 * Hook Principal de Notificações Avançadas
 *
 * @description
 * Hook que fornece funções para criar, atualizar e remover notificações
 * de diferentes tipos. Gerencia estado interno de notificações e auto-remoção
 * baseada em duração.
 *
 * @returns {UseNotificationsReturn} Objeto com estado e funções de notificações
 *
 * @example
 * ```tsx
 * const {
 *   notifications,
 *   showSuccess,
 *   showError,
 *   removeNotification
 * } = useAdvancedNotifications();

 * ```
 */
export const useAdvancedNotifications = (): UseNotificationsReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { t } = useT();

  // Auto-remove notifications after duration
  useEffect(() => {
    const timers: Record<string, NodeJS.Timeout> = {};

    notifications.forEach((notification: unknown) => {
      if (
        !notification.persistent &&
        notification.duration &&
        notification.duration > 0
      ) {
        if (!timers[notification.id]) {
          timers[notification.id] = setTimeout(() => {
            removeNotification(notification.id);

            delete timers[notification.id];
          }, notification.duration);

        } });

    return () => {
      Object.values(timers).forEach((timer: unknown) => clearTimeout(timer));};

  }, [notifications]);

  const showNotification = useCallback(
    (notification: Omit<Notification, "id" | "timestamp">): string => {
      const id = generateId();

      const newNotification: Notification = {
        id,
        timestamp: Date.now(),
        duration:
          notification.type === "loading"
            ? undefined
            : (notification.duration ?? 5000),
        ...notification,};

      setNotifications((prev: unknown) => [newNotification, ...prev]);

      return id;
    },
    [],);

  const showSuccess = useCallback(
    (title: string, message?: string, duration: number = 4000): string => {
      return showNotification({
        type: "success",
        title,
        message,
        duration,
      });

    },
    [showNotification],);

  const showError = useCallback(
    (title: string, message?: string, duration: number = 6000): string => {
      return showNotification({
        type: "error",
        title,
        message,
        duration,
        persistent: duration === 0,
      });

    },
    [showNotification],);

  const showWarning = useCallback(
    (title: string, message?: string, duration: number = 5000): string => {
      return showNotification({
        type: "warning",
        title,
        message,
        duration,
      });

    },
    [showNotification],);

  const showInfo = useCallback(
    (title: string, message?: string, duration: number = 4000): string => {
      return showNotification({
        type: "info",
        title,
        message,
        duration,
      });

    },
    [showNotification],);

  const showLoading = useCallback(
    (title: string, message?: string): string => {
      return showNotification({
        type: "loading",
        title,
        message,
        persistent: true,
      });

    },
    [showNotification],);

  const updateNotification = useCallback(
    (id: string, updates: Partial<Notification>) => {
      setNotifications((prev: unknown) =>
        prev.map((notification: unknown) =>
          notification.id === id
            ? { ...notification, ...updates }
            : notification,
        ),);

    },
    [],);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev: unknown) =>
      prev.filter((notification: unknown) => notification.id !== id),);

  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);

  }, []);

  const clearByType = useCallback((type: Notification["type"]) => {
    setNotifications((prev: unknown) =>
      prev.filter((notification: unknown) => notification.type !== type),);

  }, []);

  return {
    notifications,
    showNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    updateNotification,
    removeNotification,
    clearAll,
    clearByType,};
};

// Hook para operações assíncronas com feedback automático
export const useAsyncOperation = () => {
  const notifications = useAdvancedNotifications();

  const { t } = useT();

  const executeWithFeedback = useCallback(
    async <T>(
      operation: () => Promise<T>,
      options: {
        loadingMessage?: string;
        successMessage?: string;
        errorMessage?: string;
        successCallback??: (e: any) => void;
        errorCallback??: (e: any) => void;
      } = {},
    ): Promise<T | null> => {
      const {
        loadingMessage = t("actions.loading"),
        successMessage = t("messages.operation_success"),
        errorMessage = t("messages.operation_failed"),
        successCallback,
        errorCallback,
      } = options;

      const loadingId = notifications.showLoading(loadingMessage);

      try {
        const result = await operation();

        notifications.removeNotification(loadingId);

        notifications.showSuccess(successMessage);

        successCallback?.(result);

        return result;
      } catch (error: unknown) {
        notifications.removeNotification(loadingId);

        const errorMsg = getErrorMessage(error) || errorMessage;
        notifications.showError(errorMessage, errorMsg);

        errorCallback?.(error);

        return null;
      } ,
    [notifications, t],);

  return {
    ...notifications,
    executeWithFeedback,};
};

// Preset de notificações para ações comuns
export const notificationPresets = {
  save: {
    loading: "Salvando...",
    success: "Salvo com sucesso!",
    error: "Erro ao salvar",
  },
  delete: {
    loading: "Excluindo...",
    success: "Excluído com sucesso!",
    error: "Erro ao excluir",
  },
  create: {
    loading: "Criando...",
    success: "Criado com sucesso!",
    error: "Erro ao criar",
  },
  update: {
    loading: "Atualizando...",
    success: "Atualizado com sucesso!",
    error: "Erro ao atualizar",
  },
  send: {
    loading: "Enviando...",
    success: "Enviado com sucesso!",
    error: "Erro ao enviar",
  },
  import: {
    loading: "Importando dados...",
    success: "Dados importados com sucesso!",
    error: "Erro na importação",
  },
  export: {
    loading: "Exportando dados...",
    success: "Dados exportados com sucesso!",
    error: "Erro na exportação",
  },};

export default useAdvancedNotifications;
