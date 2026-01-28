// =========================================
// LAZY COMPONENTS - COMPONENTES LAZY LOADING
// =========================================
// Sistema de lazy loading otimizado para componentes pesados
// Máximo: 200 linhas

import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

// =========================================
// COMPONENTES LAZY
// =========================================

// Componentes principais
export const ProductsModule = lazy(() => import('./ProductsModule'));
export const ProductsDashboard = lazy(() => import('./ProductsDashboard'));
export const ProductsHeader = lazy(() => import('./ProductsHeader'));
export const ProductsStats = lazy(() => import('./ProductsStats'));
export const ProductsFilters = lazy(() => import('./ProductsFilters'));
export const ProductsContent = lazy(() => import('./ProductsContent'));
export const ProductsActions = lazy(() => import('./ProductsActions'));

// Componentes de exibição
export const ProductsList = lazy(() => import('./ProductsList'));
export const ProductsGrid = lazy(() => import('./ProductsGrid'));

// Componentes de funcionalidades
export const ProductsForm = lazy(() => import('./ProductsForm'));
export const ProductsCard = lazy(() => import('./ProductsCard'));
export const VariationsManager = lazy(() => import('./VariationsManager'));
export const ImagesManager = lazy(() => import('./ImagesManager'));
export const ReviewsManager = lazy(() => import('./ReviewsManager'));
export const AnalyticsDashboard = lazy(() => import('./AnalyticsDashboard'));

// =========================================
// COMPONENTES DE LOADING
// =========================================

interface LazyLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  className?: string;
}

export const LazyLoading: React.FC<LazyLoadingProps> = ({
  size = 'md',
  message = 'Carregando...',
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center">
        <LoadingSpinner size={size} />
        <p className="mt-3 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
};

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorBoundary?: boolean;
  className?: string;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback = <LazyLoading />,
  errorBoundary = true,
  className = ''
}) => {
  if (errorBoundary) {
    return (
      <ErrorBoundary>
        <Suspense fallback={fallback}>
          <div className={className}>
            {children}
          </div>
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <Suspense fallback={fallback}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
};

// =========================================
// ERROR BOUNDARY
// =========================================

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, never>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Erro ao carregar componente
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Ocorreu um erro ao carregar este componente. Tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// =========================================
// PRELOADING UTILITIES
// =========================================

class ComponentPreloader {
  private preloadedComponents = new Set<string>();
  private preloadQueue: Array<() => Promise<any>> = [];

  async preloadComponent(componentName: string, importFn: () => Promise<any>): Promise<void> {
    if (this.preloadedComponents.has(componentName)) {
      return;
    }

    try {
      await importFn();
      this.preloadedComponents.add(componentName);
    } catch (error) {
      console.warn(`Failed to preload component ${componentName}:`, error);
    }
  }

  queuePreload(componentName: string, importFn: () => Promise<any>): void {
    if (!this.preloadedComponents.has(componentName)) {
      this.preloadQueue.push(() => this.preloadComponent(componentName, importFn));
    }
  }

  async processPreloadQueue(): Promise<void> {
    const promises = this.preloadQueue.map(fn => fn());
    this.preloadQueue = [];
    await Promise.allSettled(promises);
  }

  isPreloaded(componentName: string): boolean {
    return this.preloadedComponents.has(componentName);
  }

  clearPreloaded(): void {
    this.preloadedComponents.clear();
    this.preloadQueue = [];
  }
}

const componentPreloader = new ComponentPreloader();

// =========================================
// PRELOADING FUNCTIONS
// =========================================

export const preloadProductsModule = () => {
  componentPreloader.queuePreload('ProductsModule', () => import('./ProductsModule'));
};

export const preloadProductsForm = () => {
  componentPreloader.queuePreload('ProductsForm', () => import('./ProductsForm'));
};

export const preloadVariationsManager = () => {
  componentPreloader.queuePreload('VariationsManager', () => import('./VariationsManager'));
};

export const preloadImagesManager = () => {
  componentPreloader.queuePreload('ImagesManager', () => import('./ImagesManager'));
};

export const preloadReviewsManager = () => {
  componentPreloader.queuePreload('ReviewsManager', () => import('./ReviewsManager'));
};

export const preloadAnalyticsDashboard = () => {
  componentPreloader.queuePreload('AnalyticsDashboard', () => import('./AnalyticsDashboard'));
};

export const preloadAllComponents = async () => {
  await Promise.allSettled([
    preloadProductsModule(),
    preloadProductsForm(),
    preloadVariationsManager(),
    preloadImagesManager(),
    preloadReviewsManager(),
    preloadAnalyticsDashboard()
  ]);
  await componentPreloader.processPreloadQueue();
};

// =========================================
// HOOK PARA PRELOADING
// =========================================

export const useComponentPreloader = () => {
  const preloadOnHover = (componentName: string, importFn: () => Promise<any>) => {
    return {
      onMouseEnter: () => componentPreloader.queuePreload(componentName, importFn),
      onFocus: () => componentPreloader.queuePreload(componentName, importFn)
    };
  };

  const preloadOnIntersection = (componentName: string, importFn: () => Promise<any>) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            componentPreloader.queuePreload(componentName, importFn);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    return {
      ref: (element: HTMLElement | null) => {
        if (element) {
          observer.observe(element);
        }
      }
    };
  };

  return {
    preloadOnHover,
    preloadOnIntersection,
    isPreloaded: componentPreloader.isPreloaded.bind(componentPreloader),
    preloadAll: preloadAllComponents
  };
};

// =========================================
// COMPONENTE DE PRELOADING INTELIGENTE
// =========================================

interface SmartLazyProps {
  component: ComponentType<any>;
  fallback?: React.ReactNode;
  preloadOnHover?: boolean;
  preloadOnIntersection?: boolean;
  preloadDelay?: number;
  className?: string;
  [key: string]: any;
}

export const SmartLazy: React.FC<SmartLazyProps> = ({
  component: Component,
  fallback = <LazyLoading />,
  preloadOnHover = false,
  preloadOnIntersection = false,
  preloadDelay = 0,
  className = '',
  ...props
}) => {
  const { preloadOnHover: preloadHover, preloadOnIntersection: preloadIntersection } = useComponentPreloader();
  const [shouldLoad, setShouldLoad] = React.useState(false);

  React.useEffect(() => {
    if (preloadDelay > 0) {
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, preloadDelay);
      return () => clearTimeout(timer);
    } else {
      setShouldLoad(true);
    }
  }, [preloadDelay]);

  const hoverProps = preloadOnHover ? preloadHover('Component', () => Promise.resolve()) : {};
  const intersectionProps = preloadOnIntersection ? preloadIntersection('Component', () => Promise.resolve()) : {};

  if (!shouldLoad) {
    return <div className={className} {...hoverProps} {...intersectionProps} />;
  }

  return (
    <LazyWrapper fallback={fallback} className={className}>
      <Component {...props} />
    </LazyWrapper>
  );
};

// =========================================
// EXPORTS
// =========================================

export {
  componentPreloader,
  ErrorBoundary
};
