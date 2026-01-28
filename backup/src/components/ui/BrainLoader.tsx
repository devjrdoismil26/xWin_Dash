import React from 'react';
import { getSizeClasses } from './design-tokens';
import { cn } from '@/lib/utils';

export type BrainLoaderVariant = 'default' | 'pulse' | 'glow' | 'thinking';

export interface BrainLoaderProps {
  size?: ComponentSize;
  variant?: BrainLoaderVariant;
  label?: string;
  className?: string;
}

const variantClasses: Record<BrainLoaderVariant, string> = {
  default: 'animate-pulse',
  pulse: 'animate-pulse',
  glow: 'animate-pulse shadow-lg shadow-blue-500/50',
  thinking: 'animate-bounce',
};

const BrainLoader: React.FC<BrainLoaderProps> = ({ size = 'md', className = '', label, variant = 'default' }) => {
  const sizeClasses = getSizeClasses(size, 'icon');
  
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="flex flex-col items-center gap-2">
        <div className={cn(sizeClasses, variantClasses[variant], 'relative')}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-gray-800 dark:text-gray-200"
          >
            <path d="M10 2a6 6 0 00-6 6c0 1.4.5 2.8 1.4 3.9L6 22h3l1-5h4l1 5h3l1.6-10.1A6 6 0 0014 2c-1.5 0-2.8.5-3.8 1.3C9.7 2.5 8.5 2 7 2" />
          </svg>
          {variant === 'thinking' && (
            <>
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0ms' }} />
              <div className="absolute -top-2 right-0 w-1 h-1 bg-purple-500 rounded-full animate-ping" style={{ animationDelay: '200ms' }} />
              <div className="absolute -top-1 right-1 w-1 h-1 bg-green-500 rounded-full animate-ping" style={{ animationDelay: '400ms' }} />
            </>
          )}
          {variant === 'glow' && (
            <div className="absolute inset-0 animate-pulse">
              <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-sm" />
            </div>
          )}
        </div>
        {label && <span className="text-xs text-gray-600 dark:text-gray-400 animate-pulse">{label}</span>}
      </div>
    </div>
  );
};

export default BrainLoader;
