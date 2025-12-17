import { apiClient } from '@/services';
/**
 * Hook useApp - Contexto Global da Aplicação
 *
 * @description
 * Hook principal que fornece acesso ao contexto global da aplicação,
 * incluindo configuração, tradução, tema, notificações, loading states,
 * formatação e utilitários. Consolida múltiplos hooks e contextos em
 * uma interface única e centralizada.
 *
 * Funcionalidades principais:
 * - Configuração global da aplicação
 * - Tradução e internacionalização
 * - Gerenciamento de tema (light/dark)
 * - Notificações centralizadas
 * - Loading states gerenciados
 * - Utilitários de formatação (data, moeda, número)
 * - Informações de performance
 *
 * @module hooks/useApp
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { useApp } from '@/hooks/useApp';
 *
 * const { theme, t, showSuccess, formatDate, isLoading } = useApp();

 *
 * // Usar tema
 * <div className={isDark ? 'dark' : '' } >...</div>
 *
 * // Tradução
 * <p>{t('common.save')}</p>
 *
 * // Notificação
 * showSuccess('Sucesso', 'Operação concluída');

 * ```
 */

import { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { useAdvancedNotifications } from './useAdvancedNotifications';
import { useLoadingStates } from './useLoadingStates';
import { useFormValidation } from './useFormValidation';
import { useTheme } from '../shared/components/ThemeProvider';
import { useNotifications } from '../shared/components/Notifications';
import { config } from '../config/appConfig';

/**
 * Interface para o contexto global da aplicação
 *
 * @description
 * Define todas as propriedades e métodos disponíveis no contexto global
 * da aplicação através do hook useApp.
 *
 * @interface AppContextType
 * @property {typeof config} config - Configuração global da aplicação
 * @property {(key: string, params?: Record<string, any>) => string} t - Função de tradução
 * @property {(language: string) => void} changeLanguage - Função para alterar idioma
 * @property {string} currentLanguage - Idioma atual
 * @property {any} theme - Tema atual
 * @property {() => void} toggleTheme - Função para alternar tema
 * @property {(theme: unknown) => void} setTheme - Função para definir tema
 * @property {boolean} isDark - Se está em modo escuro
 * @property {(message: string) => void} showSuccess - Exibir notificação de sucesso
 * @property {(message: string) => void} showError - Exibir notificação de erro
 * @property {(message: string) => void} showWarning - Exibir notificação de aviso
 * @property {(message: string) => void} showInfo - Exibir notificação informativa
 * @property {Record<string, boolean>} isLoading - Estados de loading por chave
 * @property {(key: string, loading: boolean) => void} setLoading - Definir estado de loading
 * @property {unknown[]} notifications - Lista de notificações
 * @property {number} unreadCount - Contagem de notificações não lidas
 * @property {(id: string) => void} markAsRead - Marcar notificação como lida
 * @property {(date: string | Date) => string} formatDate - Formatar data
 * @property {(amount: number) => string} formatCurrency - Formatar moeda
 * @property {(number: number) => string} formatNumber - Formatar número
 * @property { isSlowConnection: boolean; enableOptimizations: boolean } performance - Informações de performance
 */
interface AppContextType {
  // Configuração
  config: typeof config;
  // Tradução
  t: (key: string, params?: Record<string, any>) => string;
  changeLanguage?: (e: any) => void;
  currentLanguage: string;
  // Tema
  theme: unknown;
  toggleTheme??: (e: any) => void;
  setTheme?: (e: any) => void;
  isDark: boolean;
  // Notificações
  showSuccess?: (e: any) => void;
  showError?: (e: any) => void;
  showWarning?: (e: any) => void;
  showInfo?: (e: any) => void;
  // Loading States
  isLoading: Record<string, boolean>;
  setLoading?: (e: any) => void;
  // Centro de Notificações
  notifications: string[];
  unreadCount: number;
  markAsRead?: (e: any) => void;
  // Utilitários
  formatDate: (date: string | Date) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (number: number) => string;
  // Performance
  performance: {
    isSlowConnection: boolean;
  enableOptimizations: boolean; };

  // Features
  isFeatureEnabled: (feature: string) => boolean;
  getModuleConfig: (module: string) => any;
}

/**
 * Hook Principal da Aplicação
 *
 * @description
 * Hook que combina todos os hooks globais da aplicação, fornecendo
 * acesso unificado a tradução, tema, notificações, loading states,
 * formatação e performance. Inclui tratamento global de erros e
 * monitoramento de conectividade.
 *
 * @returns {AppContextType} Contexto global da aplicação com todas as funcionalidades
 *
 * @example
 * ```tsx
 * const { t, theme, showSuccess, formatDate, isLoading } = useApp();

 * ```
 */
export const useApp = (): AppContextType => {
  // Hooks básicos
  const { translate, changeLanguage, currentLanguage, language } = useTranslation();

  const { showSuccess, showError, showNotification } =
    useAdvancedNotifications();

  const loadingStates = useLoadingStates();

  const { setLoading } = loadingStates;
  const { theme, toggleMode, isDark, updateTheme } = useTheme();

  const { notifications, unreadCount, markAsRead } = useNotifications();

  // Performance monitoring
  const performance = useMemo(() => {
    const connection = (navigator as any).connection;
    const isSlowConnection = connection
      ? connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g"
      : false;

    return {
      isSlowConnection,
      enableOptimizations:
        isSlowConnection || config.performance.enableVirtualization,};

  }, []);

  // Utilitários de formatação
  const formatDate = useCallback((date: string | Date) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat(
      config.localization.dateFormat === "DD/MM/YYYY" ? "pt-BR" : "en-US",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      },
    ).format(dateObj);

  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: config.localization.currency,
    }).format(amount);

  }, []);

  const formatNumber = useCallback((number: number) => {
    return new Intl.NumberFormat("pt-BR").format(number);

  }, []);

  // Feature flags
  const isFeatureEnabled = useCallback((feature: string) => {
    return config.features[feature] === true;
  }, []);

  const getModuleConfig = useCallback((module: string) => {
    return config.modules[module] || { enabled: false, features: []};

  }, []);

  // Notificações simplificadas
  const showWarning = useCallback(
    (message: string) => {
      showNotification({ type: "warning", title: message });

    },
    [showNotification],);

  const showInfo = useCallback(
    (message: string) => {
      showNotification({ type: "info", title: message });

    },
    [showNotification],);

  // Inicialização da aplicação
  useEffect(() => {
    // Analytics de performance
    if (
      config.analytics.enableTracking &&
      config.analytics.events.performance
    ) {
      const perfObserver = new PerformanceObserver((list: unknown) => {
        const entries = list.getEntries();

        entries.forEach((entry: unknown) => {
          if (entry.entryType === "navigation") {
          } );

      });

      try {
        perfObserver.observe({ entryTypes: ["navigation", "measure"] });

      } catch (e) {
        // Observer não suportado
      }

      return () => {
        perfObserver.disconnect();};

    } , []);

  // Tratamento de erros global
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      showError("Ocorreu um erro inesperado. Nossa equipe foi notificada.");

      // Enviar erro para monitoramento se habilitado
      if (config.analytics.enableTracking && config.analytics.events.errors) {
        // Aqui seria enviado para um serviço de monitoramento como Sentry
      } ;

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      showError("Erro de rede ou processamento. Tente novamente.");};

    window.addEventListener("error", handleError);

    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);

      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,);};

  }, [showError]);

  // Monitoramento de conectividade
  useEffect(() => {
    const handleOnline = () => {
      showSuccess("Conexão restaurada!");};

    const handleOffline = () => {
      showWarning(
        "Você está offline. Algumas funcionalidades podem não funcionar.",);};

    window.addEventListener("online", handleOnline);

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);

      window.removeEventListener("offline", handleOffline);};

  }, [showSuccess, showWarning]);

  return {
    // Configuração
    config,

    // Tradução
    t: translate,
    changeLanguage: changeLanguage ? (lang: string) => changeLanguage(lang as any) : (() => {}),
    currentLanguage: currentLanguage || language,

    // Tema
    theme,
    toggleTheme: toggleMode || (() => {}),
    setTheme: updateTheme || (() => {}),
    isDark: isDark ?? false,

    // Notificações
    showSuccess,
    showError,
    showWarning,
    showInfo,

    // Loading States
    isLoading: {} as Record<string, boolean>, // TODO: Implementar conversão de função para objeto
    setLoading: (key: string, loading: boolean) => loadingStates.setLoading(key, loading),

    // Centro de Notificações
    notifications,
    unreadCount,
    markAsRead,

    // Utilitários
    formatDate,
    formatCurrency,
    formatNumber,

    // Performance
    performance,

    // Features
    isFeatureEnabled,
    getModuleConfig,};
};

/**
 * Hook para validação de formulários com contexto da aplicação
 */
export default useApp;
