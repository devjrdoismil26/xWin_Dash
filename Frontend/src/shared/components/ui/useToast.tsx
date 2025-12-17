/**
 * Hook useToast - Gerenciador de Toast Notifications
 *
 * @description
 * Hook simples para gerenciar notifica??es toast com suporte a m?ltiplos
 * tipos (success, error, warning, info) e opera??es de adicionar/remover.
 *
 * Funcionalidades principais:
 * - Gerenciamento de lista de toasts
 * - M?ltiplos tipos de toast (success, error, warning, info)
 * - Adicionar e remover toasts
 * - API simplificada para tipos comuns
 *
 * @module components/ui/useToast
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import useToast from '@/shared/components/ui/useToast';
 *
 * const { toast, toasts, removeToast } = useToast();

 *
 * const handleSave = () => {
 *   toast.success('Dados salvos com sucesso!');

 *};

 *
 * // Renderizar toasts
 * {(toasts || []).map(toast => (
 *   <Toast key={toast.id} {...toast} onClose={ () => removeToast(toast.id) } />
 * ))}
 * ```
 */

import React from "react";
import { generateId } from '@/lib/utils';

/**
 * Retorno do hook useToast
 *
 * @interface UseToastReturn
 * @property {Object} toast - Objeto com m?todos para criar toasts (success, error, warning, info)
 * @property {Array<ToastData>} toasts - Array de toasts atuais
 * @property {(id: string) => void} removeToast - Fun??o para remover toast
 * @property {(options: ToastOptions | string) => void} addToast - Fun??o para adicionar toast
 */
interface UseToastReturn {
  toast: {
    success?: (e: any) => void;
  error?: (e: any) => void;
  warning?: (e: any) => void;
  info?: (e: any) => void; };

  toasts: Array<{
    id: string;
    message?: string;
    type?: string;
    [key: string]: unknown;
  }>;
  removeToast?: (e: any) => void;
  addToast?: (e: any) => void;
}

/**
 * Hook useToast
 *
 * @description
 * Hook que gerencia estado de toasts e fornece API simplificada para
 * criar notifica??es toast de diferentes tipos.
 *
 * @returns {UseToastReturn} Objeto com toast, toasts, removeToast e addToast
 */
export default function useToast(): UseToastReturn {
  const [toasts, setToasts] = React.useState<Array<{
    id: string;
    message?: string;
    type?: string;
    [key: string]: unknown;
  }>>([]);

  const addToast = React.useCallback((options: string | Record<string, any>) => {
    if (typeof options === "string") {
      setToasts((prev) => [
        { id: generateId("toast"), message: options, type: "info" },
        ...prev,
      ]);

      return;
    }
    setToasts((prev) => [{ id: generateId("toast"), ...options }, ...prev]);

  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => (prev || []).filter((t) => t.id !== id));

  }, []);

  const toast = React.useMemo(
    () => ({
      success: (message: string, options: Record<string, any> = {}) =>
        addToast({ ...options, message, type: "success" }),
      error: (message: string, options: Record<string, any> = {}) =>
        addToast({ ...options, message, type: "error" }),
      warning: (message: string, options: Record<string, any> = {}) =>
        addToast({ ...options, message, type: "warning" }),
      info: (message: string, options: Record<string, any> = {}) =>
        addToast({ ...options, message, type: "info" }),
    }),
    [addToast],);

  return { toast, toasts, removeToast, addToast};

}
