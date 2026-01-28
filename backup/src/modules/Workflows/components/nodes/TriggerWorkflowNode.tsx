import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Zap, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Database, 
  Globe,
  Smartphone,
  Bell,
  MousePointer,
  FileText,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Target,
  BarChart,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
const TriggerWorkflowNode = ({ data, isConnectable, selected }) => {
  const getTriggerIcon = (type) => {
    switch (type) {
      case 'webhook':
        return <Globe className="h-4 w-4" />;
      case 'schedule':
        return <Clock className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'manual':
        return <MousePointer className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'notification':
        return <Bell className="h-4 w-4" />;
      case 'api':
        return <Globe className="h-4 w-4" />;
      case 'event':
        return <Zap className="h-4 w-4" />;
      case 'condition':
        return <CheckCircle className="h-4 w-4" />;
      case 'threshold':
        return <BarChart className="h-4 w-4" />;
      case 'trend':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };
  const getTriggerColor = (type) => {
    switch (type) {
      case 'webhook':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'schedule':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'email':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'whatsapp':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'database':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'manual':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'file':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'user':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'notification':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'api':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'event':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'condition':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'threshold':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      case 'trend':
        return 'border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100';
      default:
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
    }
  };
  const triggerType = data?.triggerType || 'webhook';
  const triggerName = data?.name || 'Trigger Workflow';
  const triggerDescription = data?.description || 'Dispara outro workflow';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getTriggerColor(triggerType),
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
      />
      <div className="workflow-node-header">
        <div className="workflow-node-icon bg-blue-500">
          {getTriggerIcon(triggerType)}
        </div>
        <div className="workflow-node-title">
          {triggerName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {triggerDescription}
        </p>
        {data?.triggerType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {triggerType}
            </span>
          </div>
        )}
        {data?.targetWorkflow && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Workflow:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.targetWorkflow}
            </span>
          </div>
        )}
        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Parâmetros:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(data.parameters).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.parameters).length > 2 && (
                <div className="text-xs text-gray-500">
                  +{Object.keys(data.parameters).length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.conditions && data.conditions.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Condições:</span>
            <div className="mt-1 space-y-1">
              {data.conditions.slice(0, 2).map((condition, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {condition}
                </div>
              ))}
              {data.conditions.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.conditions.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.schedule && (
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {data.schedule}
            </span>
          </div>
        )}
        {data?.timeout && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Timeout: {data.timeout}s
            </span>
          </div>
        )}
        {data?.retryCount && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tentativas:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.retryCount}
            </span>
          </div>
        )}
        {data?.priority && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Prioridade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.priority === 'high' && 'bg-red-100 text-red-800',
              data.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
              data.priority === 'low' && 'bg-green-100 text-green-800'
            )}>
              {data.priority}
            </span>
          </div>
        )}
        {data?.status && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.status === 'active' && 'bg-green-100 text-green-800',
              data.status === 'paused' && 'bg-yellow-100 text-yellow-800',
              data.status === 'draft' && 'bg-gray-100 text-gray-800',
              data.status === 'completed' && 'bg-blue-100 text-blue-800',
              data.status === 'failed' && 'bg-red-100 text-red-800'
            )}>
              {data.status}
            </span>
          </div>
        )}
        {data?.async !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.async ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.async ? 'Execução Assíncrona' : 'Execução Síncrona'}
            </span>
          </div>
        )}
        {data?.waitForCompletion !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.waitForCompletion ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.waitForCompletion ? 'Aguardar Conclusão' : 'Não Aguardar'}
            </span>
          </div>
        )}
        {data?.passData !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.passData ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.passData ? 'Passar Dados' : 'Não Passar Dados'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Zap className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">TRIGGER</span>
        </div>
      </div>
    </div>
  );
};
export default TriggerWorkflowNode;
