import React from 'react';
import Button from './Button';
import { getSizeClasses } from './design-tokens';

export type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'skeleton';

export interface LoadingSpinnerProps {
  className?: string;
  size?: ComponentSize;
  text?: string;
  showText?: boolean;
  variant?: Exclude<LoadingVariant, 'skeleton'>;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 'md',
  text = 'Carregando conteúdo',
  showText = true,
  variant = 'spinner',
}) => {
  const sizeClasses = getSizeClasses(size, 'icon');
  const textSizeClasses = getSizeClasses(size, 'text');

  if (variant === 'dots') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        {showText && text && <span className={`text-gray-600 ${textSizeClasses}`}>{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center justify-center space-x-3 ${className}`}>
        <div className={`bg-blue-600 rounded-full animate-pulse ${sizeClasses}`} />
        {showText && text && <span className={`text-gray-600 ${textSizeClasses}`}>{text}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${sizeClasses}`} />
      {showText && text && <span className={`text-gray-600 ${textSizeClasses}`}>{text}</span>}
    </div>
  );
};

export interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = '', lines = 3, avatar = false }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {avatar && <div className="flex items-center space-x-3"><div className="rounded-full bg-gray-200 h-10 w-10" /><div className="flex-1"><div className="h-3 bg-gray-200 rounded w-24" /></div></div>}
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-4 bg-gray-200 rounded w-full" />
      ))}
    </div>
  );
};

export interface UseLoadingState {
  isLoading: boolean;
  error: string | null;
  success: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  setErrorState: (message: string) => void;
  setSuccessState: (message: string) => void;
  reset: () => void;
}

export const useLoadingState = (initialLoading: boolean = false): UseLoadingState => {
  const [isLoading, setIsLoading] = React.useState<boolean>(initialLoading);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const setErrorState = React.useCallback((message: string) => {
    setIsLoading(false);
    setError(message);
    setSuccess(null);
  }, []);

  const setSuccessState = React.useCallback((message: string) => {
    setIsLoading(false);
    setError(null);
    setSuccess(message);
  }, []);

  const reset = React.useCallback(() => {
    setIsLoading(false);
    setError(null);
    setSuccess(null);
  }, []);

  return { isLoading, error, success, startLoading, stopLoading, setErrorState, setSuccessState, reset };
};

export interface TableLoadingSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableLoadingSkeleton: React.FC<TableLoadingSkeletonProps> = ({ rows = 5, columns = 4, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
        {Array.from({ length: columns }).map((_, index) => (
          <div key={`thead-${index}`} className="h-5 bg-gray-200 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={`cell-${rowIndex}-${colIndex}`} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
      ))}
    </div>
  );
};

export interface CardLoadingSkeletonProps {
  count?: number;
  className?: string;
}

export const CardLoadingSkeleton: React.FC<CardLoadingSkeletonProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`card-${index}`} className="border border-gray-200 rounded-lg p-4 space-y-3">
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="flex justify-end">
            <Button variant="secondary" disabled>
              <span className="opacity-60">Aguarde</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Export all skeleton components from SkeletonLoaders
export {
  DashboardSkeleton,
  TableSkeleton,
  ChatSkeleton,
  FormSkeleton,
  CardGridSkeleton,
  ProfileSkeleton,
  CalendarSkeleton
} from './SkeletonLoaders';

export default LoadingSpinner;
