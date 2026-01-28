/**
 * Advanced Toast System - xWin Dash
 * Sistema de notificações avançado com contexto e ações
 */

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';
import { 
  CheckCircle, 
  AlertCircle, 
  Info, 
  X,
  AlertTriangle,
  Loader2,
  Undo2,
  ExternalLink,
  Download
} from 'lucide-react';

// ===== TOAST TYPES =====
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  action: () => void;
  style?: 'primary' | 'secondary' | 'danger';
}

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number; // 0 = persistent
  actions?: ToastAction[];
  undoAction?: () => void;
  onClose?: () => void;
  context?: {
    module?: string;
    operation?: string;
    entityId?: string;
  };
  metadata?: Record<string, any>;
}

// ===== TOAST CONTEXT =====
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAll: () => void;
  
  // Convenience methods
  success: (title: string, options?: Partial<Toast>) => string;
  error: (title: string, options?: Partial<Toast>) => string;
  warning: (title: string, options?: Partial<Toast>) => string;
  info: (title: string, options?: Partial<Toast>) => string;
  loading: (title: string, options?: Partial<Toast>) => string;
  
  // Contextual toasts
  operationSuccess: (operation: string, options?: Partial<Toast>) => string;
  operationError: (operation: string, error: string, options?: Partial<Toast>) => string;
  undoableAction: (action: string, undoFn: () => void, options?: Partial<Toast>) => string;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ===== TOAST PROVIDER =====
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = generateId();
    const toast: Toast = {
      id,
      duration: 5000, // Default 5s
      ...toastData
    };

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      return newToasts.slice(0, maxToasts);
    });

    // Auto-remove if duration is set
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, [generateId, maxToasts]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, ...options });
  }, [addToast]);

  const error = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, duration: 0, ...options }); // Persist errors
  }, [addToast]);

  const warning = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, ...options });
  }, [addToast]);

  const info = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, ...options });
  }, [addToast]);

  const loading = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'loading', title, duration: 0, ...options }); // Persist loading
  }, [addToast]);

  // Contextual methods
  const operationSuccess = useCallback((operation: string, options?: Partial<Toast>) => {
    return success(`${operation} realizada com sucesso`, {
      description: 'A operação foi concluída sem erros.',
      context: { operation },
      ...options
    });
  }, [success]);

  const operationError = useCallback((operation: string, error: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      title: `Erro ao ${operation.toLowerCase()}`,
      description: error,
      context: { operation },
      actions: [{
        label: 'Tentar novamente',
        action: () => {
          // This would typically retry the operation
          console.log('Retrying operation:', operation);
        },
        style: 'primary'
      }],
      ...options
    });
  }, [addToast]);

  const undoableAction = useCallback((action: string, undoFn: () => void, options?: Partial<Toast>) => {
    return success(`${action} realizada`, {
      description: 'Clique em desfazer se foi um erro.',
      undoAction: undoFn,
      duration: 8000, // Longer duration for undo
      ...options
    });
  }, [success]);

  const contextValue: ToastContextType = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    success,
    error,
    warning,
    info,
    loading,
    operationSuccess,
    operationError,
    undoableAction
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <ToastContainer position={position} toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

// ===== TOAST HOOK =====
export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// ===== TOAST CONTAINER =====
interface ToastContainerProps {
  position: ToastPosition;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  position,
  toasts,
  removeToast
}) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div
      className={cn(
        'fixed z-50 flex flex-col space-y-2 w-96 max-w-full',
        getPositionClasses()
      )}
    >
      {toasts.map((toast) => (
        <ToastComponent
          key={toast.id}
          toast={toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

// ===== TOAST COMPONENT =====
interface ToastComponentProps {
  toast: Toast;
  onClose: () => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200); // Wait for animation
    toast.onClose?.();
  };

  const getToastIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastBorderColor = () => {
    switch (toast.type) {
      case 'success': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'loading': return 'border-l-blue-500';
      default: return 'border-l-blue-500';
    }
  };

  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg border-l-4 p-4',
        'transform transition-all duration-300 ease-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        getToastBorderColor(),
        ENHANCED_TRANSITIONS.base,
        VISUAL_EFFECTS.shadows.lg
      )}
    >
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getToastIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {toast.title}
              </h3>
              {toast.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {toast.description}
                </p>
              )}
              
              {/* Context info */}
              {toast.context?.module && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  Módulo: {toast.context.module}
                </p>
              )}
            </div>

            {/* Close button */}
            <button
              onClick={handleClose}
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Actions */}
          {(toast.actions || toast.undoAction) && (
            <div className="mt-3 flex items-center space-x-2">
              {/* Undo action */}
              {toast.undoAction && (
                <button
                  onClick={() => {
                    toast.undoAction!();
                    handleClose();
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  <Undo2 className="h-3 w-3 mr-1" />
                  Desfazer
                </button>
              )}

              {/* Custom actions */}
              {toast.actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={() => {
                    action.action();
                    if (action.style !== 'secondary') {
                      handleClose();
                    }
                  }}
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md',
                    action.style === 'primary' && 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
                    action.style === 'danger' && 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:text-red-300',
                    (!action.style || action.style === 'secondary') && 'text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                  )}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== PREDEFINED TOAST HELPERS =====
export const createContextualToasts = () => {
  const toast = useToast();

  return {
    // Module-specific toasts
    leadCreated: (leadName: string) => 
      toast.undoableAction(
        `Lead "${leadName}" criado`,
        () => console.log('Undo lead creation'),
        { context: { module: 'Leads', operation: 'create' } }
      ),

    campaignLaunched: (campaignName: string) =>
      toast.operationSuccess(`Campanha "${campaignName}" lançada`, {
        context: { module: 'EmailMarketing', operation: 'launch' },
        actions: [{
          label: 'Ver relatório',
          action: () => console.log('View campaign report'),
          style: 'primary'
        }]
      }),

    aiVideoGenerated: (videoId: string) =>
      toast.success('Vídeo gerado com Veo 3!', {
        description: 'Seu vídeo está pronto para download.',
        context: { module: 'AI', operation: 'video-generation' },
        actions: [{
          label: 'Download',
          action: () => console.log('Download video:', videoId),
          style: 'primary'
        }, {
          label: 'Compartilhar',
          action: () => console.log('Share video:', videoId),
          style: 'secondary'
        }]
      }),

    connectionLost: () =>
      toast.warning('Conexão perdida', {
        description: 'Tentando reconectar automaticamente...',
        duration: 0,
        actions: [{
          label: 'Tentar agora',
          action: () => console.log('Manual reconnect'),
          style: 'primary'
        }]
      }),

    bulkOperationComplete: (count: number, type: string) =>
      toast.success(`${count} ${type} processados`, {
        description: 'Operação em lote concluída com sucesso.',
        actions: [{
          label: 'Ver detalhes',
          action: () => console.log('View bulk operation details'),
          style: 'secondary'
        }]
      })
  };
};

// Components are already exported individually above
