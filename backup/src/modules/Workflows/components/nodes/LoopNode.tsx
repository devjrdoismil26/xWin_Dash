import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  RotateCcw, 
  Repeat, 
  ArrowRight, 
  ArrowLeft,
  Hash,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Square,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { cn } from '@/lib/utils';
const LoopNode = ({ data, isConnectable, selected }) => {
  const getLoopIcon = (type) => {
    switch (type) {
      case 'for':
        return <Hash className="h-4 w-4" />;
      case 'while':
        return <Repeat className="h-4 w-4" />;
      case 'foreach':
        return <ArrowRight className="h-4 w-4" />;
      case 'do_while':
        return <ArrowLeft className="h-4 w-4" />;
      case 'infinite':
        return <RotateCcw className="h-4 w-4" />;
      case 'conditional':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Repeat className="h-4 w-4" />;
    }
  };
  const getLoopColor = (type) => {
    switch (type) {
      case 'for':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'while':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'foreach':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'do_while':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'infinite':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'conditional':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      default:
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
    }
  };
  const loopType = data?.loopType || 'for';
  const loopName = data?.name || 'Loop';
  const loopDescription = data?.description || 'Executa um loop';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getLoopColor(loopType),
      selected && 'selected shadow-lg ring-2 ring-blue-500'
    )}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="workflow-node-handle target"
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="workflow-node-handle source"
        id="loop"
        style={{ top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="workflow-node-handle source"
        id="exit"
        style={{ top: '70%' }}
      />
      <div className="workflow-node-header">
        <div className="workflow-node-icon bg-cyan-500">
          {getLoopIcon(loopType)}
        </div>
        <div className="workflow-node-title">
          {loopName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {loopDescription}
        </p>
        {data?.loopType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {loopType}
            </span>
          </div>
        )}
        {data?.maxIterations && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Max Iterações:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.maxIterations}
            </span>
          </div>
        )}
        {data?.currentIteration !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Iteração Atual:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.currentIteration}
            </span>
          </div>
        )}
        {data?.condition && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Condição:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.condition}
            </span>
          </div>
        )}
        {data?.variable && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Variável:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.variable}
            </span>
          </div>
        )}
        {data?.startValue && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Valor Inicial:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.startValue}
            </span>
          </div>
        )}
        {data?.endValue && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Valor Final:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.endValue}
            </span>
          </div>
        )}
        {data?.step && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Passo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.step}
            </span>
          </div>
        )}
        {data?.delay && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Delay: {data.delay}ms
            </span>
          </div>
        )}
        {data?.breakOnError !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.breakOnError ? 'bg-red-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.breakOnError ? 'Parar em Erro' : 'Continuar em Erro'}
            </span>
          </div>
        )}
        {data?.parallel !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.parallel ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.parallel ? 'Execução Paralela' : 'Execução Sequencial'}
            </span>
          </div>
        )}
        {data?.status && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.status === 'running' && 'bg-green-500',
              data.status === 'paused' && 'bg-yellow-500',
              data.status === 'stopped' && 'bg-red-500',
              data.status === 'completed' && 'bg-blue-500'
            )}></div>
            <span className="text-xs text-gray-600">
              Status: {data.status}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Repeat className="h-3 w-3 text-cyan-600" />
            <span className="text-xs text-cyan-600 font-medium">LOOP</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span className="text-xs text-blue-600">LOOP</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1 mt-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-green-600">EXIT</span>
        </div>
      </div>
    </div>
  );
};
export default LoopNode;
