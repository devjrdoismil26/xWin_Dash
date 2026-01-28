import React from 'react';
import { generateId } from '@/lib/utils';

export default function useToast() {
  const [toasts, setToasts] = React.useState([]);

  const addToast = React.useCallback((options) => {
    if (typeof options === 'string') {
      setToasts((prev) => [{ id: generateId('toast'), message: options, type: 'info' }, ...prev]);
      return;
    }
    setToasts((prev) => [{ id: generateId('toast'), ...options }, ...prev]);
  }, []);

  const removeToast = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = React.useMemo(() => ({
    success: (message, options = {}) => addToast({ ...options, message, type: 'success' }),
    error: (message, options = {}) => addToast({ ...options, message, type: 'error' }),
    warning: (message, options = {}) => addToast({ ...options, message, type: 'warning' }),
    info: (message, options = {}) => addToast({ ...options, message, type: 'info' }),
  }), [addToast]);

  return { toast, toasts, removeToast, addToast };
}
