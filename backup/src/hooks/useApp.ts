import { useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from './useTranslation';
import { useAdvancedNotifications } from './useAdvancedNotifications';
import { useLoadingStates } from './useLoadingStates';
import { useFormValidation } from './useFormValidation';
import { useTheme } from '../components/theme/UnifiedThemeSystem';
import { useNotifications } from '../components/notifications/AdvancedNotificationCenter';
import { config } from '../config/appConfig';

// Interface para o contexto global da aplicação
interface AppContextType {
  // Configuração
  config: typeof config;
  
  // Tradução
  t: (key: string, params?: Record<string, any>) => string;
  changeLanguage: (language: string) => void;
  currentLanguage: string;
  
  // Tema
  theme: any;
  toggleTheme: () => void;
  setTheme: (theme: any) => void;
  isDark: boolean;
  
  // Notificações
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  
  // Loading States
  isLoading: Record<string, boolean>;
  setLoading: (key: string, loading: boolean) => void;
  
  // Centro de Notificações
  notifications: any[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  
  // Utilitários
  formatDate: (date: string | Date) => string;
  formatCurrency: (amount: number) => string;
  formatNumber: (number: number) => string;
  
  // Performance
  performance: {
    isSlowConnection: boolean;
    enableOptimizations: boolean;
  };
  
  // Features
  isFeatureEnabled: (feature: string) => boolean;
  getModuleConfig: (module: string) => any;
}

/**
 * Hook principal da aplicação que combina todos os hooks globais
 * Fornece acesso unificado a todas as funcionalidades da aplicação
 */
export const useApp = (): AppContextType => {
  // Hooks básicos
  const { t, changeLanguage, currentLanguage } = useTranslation();
  const { showSuccess, showError, showNotification } = useAdvancedNotifications();
  const { isLoading, setLoading } = useLoadingStates();
  const { theme, toggleMode, isDark, updateTheme } = useTheme();
  const { notifications, unreadCount, markAsRead } = useNotifications();

  // Performance monitoring
  const performance = useMemo(() => {
    const connection = (navigator as any).connection;
    const isSlowConnection = connection ? 
      connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g' : false;
    
    return {
      isSlowConnection,
      enableOptimizations: isSlowConnection || config.performance.enableVirtualization
    };
  }, []);

  // Utilitários de formatação
  const formatDate = useCallback((date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(config.localization.dateFormat === 'DD/MM/YYYY' ? 'pt-BR' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(dateObj);
  }, []);

  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: config.localization.currency
    }).format(amount);
  }, []);

  const formatNumber = useCallback((number: number) => {
    return new Intl.NumberFormat('pt-BR').format(number);
  }, []);

  // Feature flags
  const isFeatureEnabled = useCallback((feature: string) => {
    return config.features[feature] === true;
  }, []);

  const getModuleConfig = useCallback((module: string) => {
    return config.modules[module] || { enabled: false, features: [] };
  }, []);

  // Notificações simplificadas
  const showWarning = useCallback((message: string) => {
    showNotification(message, 'warning');
  }, [showNotification]);

  const showInfo = useCallback((message: string) => {
    showNotification(message, 'info');
  }, [showNotification]);

  // Inicialização da aplicação
  useEffect(() => {
    // Analytics de performance
    if (config.analytics.enableTracking && config.analytics.events.performance) {
      const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            console.log('Page Load Time:', entry.duration);
          }
        });
      });
      
      try {
        perfObserver.observe({ entryTypes: ['navigation', 'measure'] });
      } catch (e) {
        // Observer não suportado
      }

      return () => {
        perfObserver.disconnect();
      };
    }
  }, []);

  // Tratamento de erros global
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Erro global capturado:', event.error);
      showError('Ocorreu um erro inesperado. Nossa equipe foi notificada.');
      
      // Enviar erro para monitoramento se habilitado
      if (config.analytics.enableTracking && config.analytics.events.errors) {
        // Aqui seria enviado para um serviço de monitoramento como Sentry
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Promise rejeitada não tratada:', event.reason);
      showError('Erro de rede ou processamento. Tente novamente.');
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [showError]);

  // Monitoramento de conectividade
  useEffect(() => {
    const handleOnline = () => {
      showSuccess('Conexão restaurada!');
    };

    const handleOffline = () => {
      showWarning('Você está offline. Algumas funcionalidades podem não funcionar.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [showSuccess, showWarning]);

  return {
    // Configuração
    config,
    
    // Tradução
    t,
    changeLanguage,
    currentLanguage,
    
    // Tema
    theme,
    toggleTheme: toggleMode,
    setTheme: updateTheme,
    isDark,
    
    // Notificações
    showSuccess,
    showError,
    showWarning,
    showInfo,
    
    // Loading States
    isLoading,
    setLoading,
    
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
    getModuleConfig
  };
};

/**
 * Hook para validação de formulários com contexto da aplicação
 */
export const useAppForm = (schema: Record<string, any>) => {
  const { t } = useApp();
  const validation = useFormValidation(schema);

  // Personalizar mensagens de erro com tradução
  const getFieldError = useCallback((field: string) => {
    const error = validation.getFieldError(field);
    return error ? t(error) : undefined;
  }, [validation, t]);

  return {
    ...validation,
    getFieldError
  };
};

/**
 * Hook para gerenciamento de API com contexto da aplicação
 */
export const useAppAPI = () => {
  const { config, isLoading, setLoading, showError } = useApp();

  const apiCall = useCallback(async (
    endpoint: string,
    options: RequestInit = {},
    loadingKey?: string
  ) => {
    if (loadingKey) {
      setLoading(loadingKey, true);
    }

    try {
      const response = await fetch(`${config.api.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      showError('Erro na comunicação com o servidor');
      throw error;
    } finally {
      if (loadingKey) {
        setLoading(loadingKey, false);
      }
    }
  }, [config.api.baseURL, setLoading, showError]);

  return { apiCall };
};

/**
 * Hook para controle de permissões
 */
export const usePermissions = () => {
  const { config } = useApp();
  
  // Aqui seria implementada a lógica de permissões baseada no usuário
  const hasPermission = useCallback((permission: string) => {
    // Por enquanto, retorna true para desenvolvimento
    // Em produção, verificaria as permissões do usuário atual
    return true;
  }, []);

  const canAccessModule = useCallback((module: string) => {
    const moduleConfig = config.modules[module];
    return moduleConfig && moduleConfig.enabled;
  }, [config]);

  return { hasPermission, canAccessModule };
};

export default useApp;
