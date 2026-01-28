import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Globe, 
  Webhook, 
  ArrowRight, 
  ArrowLeft,
  Key,
  Lock,
  Unlock,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  Video,
  Mic,
  Database,
  Code,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
const WebhookNode = ({ data, isConnectable, selected }) => {
  const getWebhookIcon = (type) => {
    switch (type) {
      case 'incoming':
        return <ArrowRight className="h-4 w-4" />;
      case 'outgoing':
        return <ArrowLeft className="h-4 w-4" />;
      case 'bidirectional':
        return <Webhook className="h-4 w-4" />;
      case 'trigger':
        return <Zap className="h-4 w-4" />;
      case 'action':
        return <Code className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  const getWebhookColor = (type) => {
    switch (type) {
      case 'incoming':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'outgoing':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'bidirectional':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'trigger':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'action':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      default:
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
    }
  };
  const webhookType = data?.webhookType || 'incoming';
  const webhookName = data?.name || 'Webhook';
  const webhookDescription = data?.description || 'Processa webhook';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getWebhookColor(webhookType),
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
        <div className="workflow-node-icon bg-green-500">
          {getWebhookIcon(webhookType)}
        </div>
        <div className="workflow-node-title">
          {webhookName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {webhookDescription}
        </p>
        {data?.webhookType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {webhookType}
            </span>
          </div>
        )}
        {data?.url && (
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              {data.url}
            </span>
          </div>
        )}
        {data?.method && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Método:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full font-medium',
              data.method.toUpperCase() === 'GET' && 'bg-green-100 text-green-800',
              data.method.toUpperCase() === 'POST' && 'bg-blue-100 text-blue-800',
              data.method.toUpperCase() === 'PUT' && 'bg-yellow-100 text-yellow-800',
              data.method.toUpperCase() === 'DELETE' && 'bg-red-100 text-red-800'
            )}>
              {data.method.toUpperCase()}
            </span>
          </div>
        )}
        {data?.secret && (
          <div className="flex items-center gap-2 mb-2">
            <Key className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Secret: {data.secret ? '***' : 'Não definido'}
            </span>
          </div>
        )}
        {data?.headers && Object.keys(data.headers).length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Headers:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(data.headers).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.headers).length > 2 && (
                <div className="text-xs text-gray-500">
                  +{Object.keys(data.headers).length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.body && (
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              Body: {typeof data.body === 'string' ? data.body : 'JSON'}
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
        {data?.expectedStatus && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Status:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.expectedStatus}
            </span>
          </div>
        )}
        {data?.authentication && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Auth:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.authentication}
            </span>
          </div>
        )}
        {data?.sslVerify !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.sslVerify ? 'bg-green-500' : 'bg-red-500'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.sslVerify ? 'SSL Verificado' : 'SSL Não Verificado'}
            </span>
          </div>
        )}
        {data?.active !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.active ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.active ? 'Ativo' : 'Inativo'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3 text-green-600" />
          <span className="text-xs text-green-600 font-medium">WEBHOOK</span>
        </div>
      </div>
    </div>
  );
};
export default WebhookNode;
