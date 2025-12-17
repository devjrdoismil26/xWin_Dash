/**
 * Sistema avançado de Toast - xWin Dash
 *
 * @description
 * Sistema completo de notificações toast avançadas com contexto React e ações customizadas.
 *
 * @module components/ui/Toast
 * @since 1.0.0
 */

import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Info, X, AlertTriangle, Loader2, Undo2 } from 'lucide-react';

// ===== TOAST TYPES =====
export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

export interface ToastAction {
  label: string;
  action??: (e: any) => void;
  style?: 'primary' | 'secondary' | 'danger'; }

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  actions?: ToastAction[];
  undoAction???: (e: any) => void;
  onClose???: (e: any) => void;
  context?: {
    module?: string;
  operation?: string;
  entityId?: string; };

  metadata?: Record<string, any>;
}

// ===== TOAST CONTEXT =====
interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast?: (e: any) => void;
  clearAll??: (e: any) => void;
  success: (title: string, options?: Partial<Toast>) => string;
  error: (title: string, options?: Partial<Toast>) => string;
  warning: (title: string, options?: Partial<Toast>) => string;
  info: (title: string, options?: Partial<Toast>) => string;
  loading: (title: string, options?: Partial<Toast>) => string;
  operationSuccess: (operation: string, options?: Partial<Toast>) => string;
  operationError: (operation: string, error: string, options?: Partial<Toast>) => string;
  undoableAction?: (e: any) => void, options?: Partial<Toast>) => string; }

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// ===== TOAST PROVIDER =====
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number; }

export const ToastProvider: React.FC<ToastProviderProps> = ({ children,
  position = 'top-right',
  maxToasts = 5
   }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));

  }, []);

  const addToast = useCallback((toastData: Omit<Toast, 'id'>) => {
    const id = generateId();

    const toast: Toast = {
      id,
      duration: 5000,
      ...toastData};

    setToasts(prev => {
      const newToasts = [toast, ...prev];
      return newToasts.slice(0, maxToasts);

    });

    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);

      }, toast.duration);

    }

    return id;
  }, [generateId, maxToasts, removeToast]);

  const clearAll = useCallback(() => {
    setToasts([]);

  }, []);

  const success = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'success', title, ...options });

  }, [addToast]);

  const error = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'error', title, duration: 0, ...options });

  }, [addToast]);

  const warning = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'warning', title, ...options });

  }, [addToast]);

  const info = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'info', title, ...options });

  }, [addToast]);

  const loading = useCallback((title: string, options?: Partial<Toast>) => {
    return addToast({ type: 'loading', title, duration: 0, ...options });

  }, [addToast]);

  const operationSuccess = useCallback((operation: string, options?: Partial<Toast>) => {
    return success(`${operation} realizada com sucesso`, {
      description: 'A operação foi concluída sem erros.',
      context: { operation },
      ...options
    });

  }, [success]);

  const operationError = useCallback((operation: string, errorMsg: string, options?: Partial<Toast>) => {
    return addToast({
      type: 'error',
      title: `Erro ao ${operation.toLowerCase()}`,
      description: errorMsg,
      context: { operation },
      actions: [{
        label: 'Tentar novamente',
        action: () => { /* retry logic */ },
        style: 'primary'
      }],
      ...options
    });

  }, [addToast]);

  const undoableAction = useCallback((action: string, undoFn??: (e: any) => void, options?: Partial<Toast>) => {
    return success(`${action} realizada`, {
      description: 'Clique em desfazer se foi um erro.',
      undoAction: undoFn,
      duration: 8000,
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
    undoableAction};

  return (
            <ToastContext.Provider value={ contextValue } />
      {children}
      <ToastContainer position={position} toasts={toasts} removeToast={removeToast} / />
    </ToastContext.Provider>);};

// ===== TOAST HOOK =====
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');

  }
  return context;};

// ===== TOAST CONTAINER =====
interface ToastContainerProps {
  position: ToastPosition;
  toasts: Toast[];
  removeToast?: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ToastContainer: React.FC<ToastContainerProps> = ({ position,
  toasts,
  removeToast
   }) => {
  const getPositionClasses = (): string => {
    switch (position) {
      case 'top-right': return 'top-4 right-4';
      case 'top-left': return 'top-4 left-4';
      case 'bottom-right': return 'bottom-4 right-4';
      case 'bottom-left': return 'bottom-4 left-4';
      case 'top-center': return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center': return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default: return 'top-4 right-4';
    } ;

  if (toasts.length === 0) return null;

  return (
        <>
      <div
      className={cn(
        'fixed z-50 flex flex-col space-y-2 w-96 max-w-full',
        getPositionClasses()
      )  }>
      </div>{toasts.map((toast: unknown) => (
        <ToastComponent
          key={ toast.id }
          toast={ toast }
          onClose={ () => removeToast(toast.id) } />
      ))}
    </div>);};

// ===== TOAST COMPONENT =====
interface ToastComponentProps {
  toast: Toast;
  onClose??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; }

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onClose    }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);

    return () => clearTimeout(timer);

  }, []);

  const handleClose = (): void => {
    setIsVisible(false);

    setTimeout(onClose, 200);

    toast.onClose?.();};

  const getToastIcon = (): React.ReactNode => {
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
    } ;

  const getToastBorderColor = (): string => {
    switch (toast.type) {
      case 'success': return 'border-l-green-500';
      case 'error': return 'border-l-red-500';
      case 'warning': return 'border-l-yellow-500';
      case 'loading': return 'border-l-blue-500';
      default: return 'border-l-blue-500';
    } ;

  return (
        <>
      <div
      className={cn(
        'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg border-l-4 p-4',
        'transform transition-all duration-300 ease-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        getToastBorderColor()
      )  }>
      </div><div className=" ">$2</div><div className="{getToastIcon()}">$2</div>
        </div>

        <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><h3 className="text-sm font-medium text-gray-900 dark:text-white" />
                {toast.title}
              </h3>
              {toast.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400" />
                  {toast.description}
                </p>
              )}
              {toast.context?.module && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500" />
                  Módulo: {toast.context.module}
                </p>
              )}
            </div>

            <button
              onClick={ handleClose }
              className="flex-shrink-0 ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              <X className="h-4 w-4" /></button></div>

          {(toast.actions || toast.undoAction) && (
            <div className="{toast.undoAction && (">$2</div>
                <button
                  onClick={() => {
                    toast.undoAction?.();

                    handleClose();

                  } className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                >
                  <Undo2 className="h-3 w-3 mr-1" />
                  Desfazer
                </button>
              )}

              {toast.actions?.map((action: unknown, index: unknown) => (
                <button
                  key={ index }
                  onClick={ () => {
                    action.action();

                    if (action.style !== 'secondary') {
                      handleClose();

                     } }
                  className={cn(
                    'inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md',
                    action.style === 'primary' && 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300',
                    action.style === 'danger' && 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900 dark:text-red-300',
                    (!action.style || action.style === 'secondary') && 'text-gray-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-300'
                  )  }>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
    </div>);};

export { ToastComponent, ToastContainer };

export default ToastProvider;
