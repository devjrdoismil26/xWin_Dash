// =========================================
// SOCIAL BUFFER UI HOOK - SOCIAL BUFFER
// =========================================

import { useMemo, useCallback, useState, useEffect } from 'react';
import { useSocialBufferStore } from './useSocialBufferStore';

// =========================================
// INTERFACES
// =========================================

interface UIState {
  loading: boolean;
  error: string | null;
  success: string | null;
  isEmpty: boolean;
  hasData: boolean;
}

interface UIActions {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: string | null) => void;
  clearMessages: () => void;
  handleError: (error: any) => void;
  handleSuccess: (message: string) => void;
}

interface UseSocialBufferUIProps {
  storeName?: string;
  autoClearSuccess?: boolean;
  successTimeout?: number;
}

// =========================================
// HOOK PRINCIPAL
// =========================================

export const useSocialBufferUI = ({
  storeName,
  autoClearSuccess = true,
  successTimeout = 3000
}: UseSocialBufferUIProps = {}): UIState & UIActions => {
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  
  const globalStore = useSocialBufferStore();

  // ===== ESTADO COMPUTADO =====
  
  const loading = useMemo(() => {
    if (storeName) {
      // Buscar loading específico do store
      switch (storeName) {
        case 'accounts':
          return globalStore.globalLoading || localLoading;
        case 'posts':
          return globalStore.globalLoading || localLoading;
        case 'schedules':
          return globalStore.globalLoading || localLoading;
        case 'analytics':
          return globalStore.globalLoading || localLoading;
        case 'hashtags':
          return globalStore.globalLoading || localLoading;
        case 'links':
          return globalStore.globalLoading || localLoading;
        case 'media':
          return globalStore.globalLoading || localLoading;
        case 'engagement':
          return globalStore.globalLoading || localLoading;
        default:
          return globalStore.globalLoading || localLoading;
      }
    }
    return globalStore.globalLoading || localLoading;
  }, [globalStore.globalLoading, localLoading, storeName]);

  const error = useMemo(() => {
    if (storeName) {
      // Buscar erro específico do store
      switch (storeName) {
        case 'accounts':
          return globalStore.globalError || localError;
        case 'posts':
          return globalStore.globalError || localError;
        case 'schedules':
          return globalStore.globalError || localError;
        case 'analytics':
          return globalStore.globalError || localError;
        case 'hashtags':
          return globalStore.globalError || localError;
        case 'links':
          return globalStore.globalError || localError;
        case 'media':
          return globalStore.globalError || localError;
        case 'engagement':
          return globalStore.globalError || localError;
        default:
          return globalStore.globalError || localError;
      }
    }
    return globalStore.globalError || localError;
  }, [globalStore.globalError, localError, storeName]);

  const success = useMemo(() => localSuccess, [localSuccess]);

  const isEmpty = useMemo(() => {
    if (storeName) {
      // Verificar se o store específico está vazio
      switch (storeName) {
        case 'accounts':
          return globalStore.getCombinedStats().accounts.total === 0;
        case 'posts':
          return globalStore.getCombinedStats().posts.total === 0;
        case 'schedules':
          return globalStore.getCombinedStats().schedules.total === 0;
        case 'hashtags':
          return globalStore.getCombinedStats().hashtags.total === 0;
        case 'links':
          return globalStore.getCombinedStats().links.total === 0;
        case 'media':
          return globalStore.getCombinedStats().media.total === 0;
        case 'engagement':
          return globalStore.getCombinedStats().engagement.monitored_posts === 0;
        default:
          return false;
      }
    }
    return false;
  }, [globalStore, storeName]);

  const hasData = useMemo(() => !isEmpty, [isEmpty]);

  // ===== AÇÕES =====

  const setLoading = useCallback((loading: boolean) => {
    setLocalLoading(loading);
    if (loading) {
      setLocalError(null);
      setLocalSuccess(null);
    }
  }, []);

  const setError = useCallback((error: string | null) => {
    setLocalError(error);
    if (error) {
      setLocalLoading(false);
      setLocalSuccess(null);
    }
  }, []);

  const setSuccess = useCallback((success: string | null) => {
    setLocalSuccess(success);
    if (success) {
      setLocalLoading(false);
      setLocalError(null);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setLocalError(null);
    setLocalSuccess(null);
    globalStore.clearGlobalError();
  }, [globalStore]);

  const handleError = useCallback((error: any) => {
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado';
    setError(errorMessage);
    console.error('SocialBuffer UI Error:', error);
  }, [setError]);

  const handleSuccess = useCallback((message: string) => {
    setSuccess(message);
    if (autoClearSuccess) {
      setTimeout(() => {
        setSuccess(null);
      }, successTimeout);
    }
  }, [setSuccess, autoClearSuccess, successTimeout]);

  // ===== AUTO-CLEAR SUCCESS =====

  useEffect(() => {
    if (localSuccess && autoClearSuccess) {
      const timer = setTimeout(() => {
        setLocalSuccess(null);
      }, successTimeout);

      return () => clearTimeout(timer);
    }
  }, [localSuccess, autoClearSuccess, successTimeout]);

  // ===== CLEANUP =====

  useEffect(() => {
    return () => {
      setLocalLoading(false);
      setLocalError(null);
      setLocalSuccess(null);
    };
  }, []);

  return {
    // Estado
    loading,
    error,
    success,
    isEmpty,
    hasData,
    
    // Ações
    setLoading,
    setError,
    setSuccess,
    clearMessages,
    handleError,
    handleSuccess
  };
};

// =========================================
// HOOKS ESPECIALIZADOS
// =========================================

export const useAccountsUI = () => useSocialBufferUI({ storeName: 'accounts' });
export const usePostsUI = () => useSocialBufferUI({ storeName: 'posts' });
export const useSchedulesUI = () => useSocialBufferUI({ storeName: 'schedules' });
export const useAnalyticsUI = () => useSocialBufferUI({ storeName: 'analytics' });
export const useHashtagsUI = () => useSocialBufferUI({ storeName: 'hashtags' });
export const useLinksUI = () => useSocialBufferUI({ storeName: 'links' });
export const useMediaUI = () => useSocialBufferUI({ storeName: 'media' });
export const useEngagementUI = () => useSocialBufferUI({ storeName: 'engagement' });

// =========================================
// HOOK PARA MEMOIZAÇÃO DE COMPONENTES
// =========================================

export const useSocialBufferMemo = <T extends any[]>(
  callback: (...args: T) => any,
  deps: T,
  options?: {
    maxAge?: number;
    maxSize?: number;
  }
) => {
  const { maxAge = 5 * 60 * 1000, maxSize = 100 } = options || {};
  
  return useMemo(() => {
    const result = callback(...deps);
    
    // Cache simples em memória (em produção, usar uma biblioteca como memoize-one)
    const cacheKey = JSON.stringify(deps);
    const cached = (window as any).__socialBufferCache || {};
    
    if (cached[cacheKey] && Date.now() - cached[cacheKey].timestamp < maxAge) {
      return cached[cacheKey].result;
    }
    
    // Limpar cache se exceder o tamanho máximo
    const cacheKeys = Object.keys(cached);
    if (cacheKeys.length >= maxSize) {
      const oldestKey = cacheKeys[0];
      delete cached[oldestKey];
    }
    
    cached[cacheKey] = {
      result,
      timestamp: Date.now()
    };
    
    (window as any).__socialBufferCache = cached;
    
    return result;
  }, deps);
};

// =========================================
// HOOK PARA DEBOUNCE
// =========================================

export const useSocialBufferDebounce = <T>(
  value: T,
  delay: number
): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// =========================================
// HOOK PARA THROTTLE
// =========================================

export const useSocialBufferThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const [lastCall, setLastCall] = useState(0);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (now - lastCall >= delay) {
        setLastCall(now);
        return callback(...args);
      }
    }) as T,
    [callback, delay, lastCall]
  );
};

// =========================================
// HOOK PARA INTERSECTION OBSERVER
// =========================================

export const useSocialBufferIntersection = (
  elementRef: React.RefObject<Element>,
  options?: IntersectionObserverInit
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [elementRef, options]);

  return isIntersecting;
};

export default useSocialBufferUI;
