/**
 * Advanced Progress Indicators - xWin Dash
 * Progress indicators para operações longas e contextuais
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ENHANCED_TRANSITIONS, VISUAL_EFFECTS } from './design-tokens';
import { 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Clock, 
  Zap, 
  Upload,
  Download,
  Brain,
  Cpu
} from 'lucide-react';

// ===== BASE PROGRESS COMPONENT =====
interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'gradient';
  animated?: boolean;
  showPercentage?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = '',
  size = 'md',
  variant = 'default',
  animated = true,
  showPercentage = true,
  label
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-2';
      case 'md': return 'h-3';
      case 'lg': return 'h-4';
      default: return 'h-3';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'success': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'danger': return 'bg-red-500';
      case 'gradient': return 'bg-gradient-to-r from-blue-500 to-purple-600';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-gray-700 dark:text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500 dark:text-gray-400 font-medium">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
        getSizeClasses()
      )}>
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            getVariantClasses(),
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ===== CIRCULAR PROGRESS =====
interface CircularProgressProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  icon?: React.ReactNode;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 120,
  strokeWidth = 8,
  className = '',
  variant = 'default',
  showPercentage = true,
  icon
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const getStrokeColor = () => {
    switch (variant) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'danger': return '#ef4444';
      default: return '#3b82f6';
    }
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            'transition-all duration-500 ease-out',
            ENHANCED_TRANSITIONS.base
          )}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {icon || (showPercentage && (
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {Math.round(value)}%
          </span>
        ))}
      </div>
    </div>
  );
};

// ===== STEP PROGRESS =====
interface StepProgressProps {
  steps: Array<{
    id: string;
    title: string;
    description?: string;
    status: 'pending' | 'current' | 'completed' | 'error';
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  orientation = 'horizontal',
  className = ''
}) => {
  const getStepIcon = (status: string, index: number) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'current':
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold">
            {index + 1}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-gray-300 text-gray-400 text-xs">
            {index + 1}
          </div>
        );
    }
  };

  if (orientation === 'vertical') {
    return (
      <div className={cn('space-y-4', className)}>
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              {getStepIcon(step.status, index)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'text-sm font-medium',
                step.status === 'completed' ? 'text-green-700 dark:text-green-400' :
                step.status === 'current' ? 'text-blue-700 dark:text-blue-400' :
                step.status === 'error' ? 'text-red-700 dark:text-red-400' :
                'text-gray-500 dark:text-gray-400'
              )}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {step.description}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className="flex-shrink-0 w-px h-8 bg-gray-200 dark:bg-gray-700 ml-2.5" />
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex items-center space-x-4', className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center space-y-2">
            {getStepIcon(step.status, index)}
            <div className="text-center">
              <h3 className={cn(
                'text-xs font-medium',
                step.status === 'completed' ? 'text-green-700 dark:text-green-400' :
                step.status === 'current' ? 'text-blue-700 dark:text-blue-400' :
                step.status === 'error' ? 'text-red-700 dark:text-red-400' :
                'text-gray-500 dark:text-gray-400'
              )}>
                {step.title}
              </h3>
            </div>
          </div>
          
          {index < steps.length - 1 && (
            <div className={cn(
              'flex-1 h-px',
              steps[index + 1].status === 'completed' ? 'bg-green-300' :
              steps[index + 1].status === 'current' ? 'bg-blue-300' :
              'bg-gray-200 dark:bg-gray-700'
            )} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ===== OPERATION PROGRESS =====
interface OperationProgressProps {
  operation: {
    type: 'upload' | 'download' | 'processing' | 'ai' | 'sync';
    title: string;
    description?: string;
    progress: number; // 0-100
    status: 'running' | 'completed' | 'error' | 'paused';
    eta?: string; // estimated time
    speed?: string; // transfer speed
  };
  onCancel?: () => void;
  onRetry?: () => void;
  className?: string;
}

export const OperationProgress: React.FC<OperationProgressProps> = ({
  operation,
  onCancel,
  onRetry,
  className = ''
}) => {
  const getOperationIcon = () => {
    switch (operation.type) {
      case 'upload': return <Upload className="h-5 w-5" />;
      case 'download': return <Download className="h-5 w-5" />;
      case 'ai': return <Brain className="h-5 w-5" />;
      case 'sync': return <Loader2 className="h-5 w-5 animate-spin" />;
      default: return <Cpu className="h-5 w-5" />;
    }
  };

  const getStatusColor = () => {
    switch (operation.status) {
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'paused': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className={cn(
      'p-4 border rounded-lg bg-white dark:bg-gray-800 space-y-3',
      ENHANCED_TRANSITIONS.base,
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={cn('p-2 rounded-lg', getStatusColor())}>
            {getOperationIcon()}
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {operation.title}
            </h3>
            {operation.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {operation.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {operation.status === 'error' && onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Tentar novamente
            </button>
          )}
          {operation.status === 'running' && onCancel && (
            <button
              onClick={onCancel}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <ProgressBar
        value={operation.progress}
        variant={
          operation.status === 'completed' ? 'success' :
          operation.status === 'error' ? 'danger' :
          'default'
        }
        animated={operation.status === 'running'}
        showPercentage={true}
      />

      {/* Details */}
      {(operation.eta || operation.speed) && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          {operation.speed && (
            <span className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>{operation.speed}</span>
            </span>
          )}
          {operation.eta && (
            <span className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{operation.eta}</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ===== ANIMATED COUNTER =====
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  className = '',
  suffix = '',
  prefix = ''
}) => {
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCurrentValue(Math.floor(progress * value));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  return (
    <span className={cn('font-mono', className)}>
      {prefix}{currentValue.toLocaleString()}{suffix}
    </span>
  );
};

// Components are already exported individually above
