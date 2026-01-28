import React from 'react';
import { Brain, Zap, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import BrainLoader from './BrainLoader.tsx';
import { cn } from '@/lib/utils';

export type AIStatus =
  | 'idle'
  | 'thinking'
  | 'processing'
  | 'analyzing'
  | 'generating'
  | 'streaming'
  | 'completed'
  | 'error';

export interface AIStatusIndicatorProps {
  status: AIStatus;
  message?: string;
  showLoader?: boolean;
  className?: string;
}

const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({ status, message, showLoader = true, className = '' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'idle':
        return { icon: Brain, color: 'text-gray-400', bgColor: 'bg-gray-100', message: message || 'IA em standby' };
      case 'thinking':
      case 'processing':
      case 'analyzing':
      case 'generating':
      case 'streaming':
        return { icon: Zap, color: 'text-blue-500', bgColor: 'bg-blue-100', message: message || 'IA processando...' };
      case 'completed':
        return { icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100', message: message || 'Processamento concluído' };
      case 'error':
        return { icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100', message: message || 'Erro no processamento' };
      default:
        return { icon: Info, color: 'text-gray-400', bgColor: 'bg-gray-100', message: message || 'Status desconhecido' };
    }
  };

  const cfg = getStatusConfig();
  const Icon = cfg.icon;

  return (
    <div className={cn('flex items-center space-x-2 px-3 py-2 rounded-lg', cfg.bgColor, className)}>
      <Icon className={cn('w-4 h-4', cfg.color)} />
      <span className={cn('text-sm font-medium', cfg.color)}>{cfg.message}</span>
      {showLoader && ['thinking', 'processing', 'analyzing', 'generating', 'streaming'].includes(status) && (
        <div className="ml-2">
          <BrainLoader size="sm" variant="thinking" />
        </div>
      )}
    </div>
  );
};

export default AIStatusIndicator;
