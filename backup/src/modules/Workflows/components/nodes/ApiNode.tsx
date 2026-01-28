import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Code, 
  Globe, 
  Database, 
  Key, 
  Lock, 
  Unlock,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Image,
  Video,
  Mic
} from 'lucide-react';
import { cn } from '@/lib/utils';
const ApiNode = ({ data, isConnectable, selected }) => {
  const getApiIcon = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return <ArrowRight className="h-4 w-4" />;
      case 'POST':
        return <ArrowLeft className="h-4 w-4" />;
      case 'PUT':
        return <RefreshCw className="h-4 w-4" />;
      case 'DELETE':
        return <AlertCircle className="h-4 w-4" />;
      case 'PATCH':
        return <Code className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };
  const getApiColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'POST':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'PUT':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'DELETE':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'PATCH':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      default:
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };
  const apiMethod = data?.method || 'GET';
  const apiName = data?.name || 'API';
  const apiDescription = data?.description || 'Faz uma chamada para API';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getApiColor(apiMethod),
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
          {getApiIcon(apiMethod)}
        </div>
        <div className="workflow-node-title">
          {apiName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {apiDescription}
        </p>
        {data?.method && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Método:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full font-medium',
              apiMethod.toUpperCase() === 'GET' && 'bg-green-100 text-green-800',
              apiMethod.toUpperCase() === 'POST' && 'bg-blue-100 text-blue-800',
              apiMethod.toUpperCase() === 'PUT' && 'bg-yellow-100 text-yellow-800',
              apiMethod.toUpperCase() === 'DELETE' && 'bg-red-100 text-red-800',
              apiMethod.toUpperCase() === 'PATCH' && 'bg-purple-100 text-purple-800'
            )}>
              {apiMethod.toUpperCase()}
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
        {data?.endpoint && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Endpoint:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.endpoint}
            </span>
          </div>
        )}
        {data?.authType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Auth:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.authType}
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
        {data?.followRedirects !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.followRedirects ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.followRedirects ? 'Seguir Redirects' : 'Não Seguir Redirects'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Code className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">API</span>
        </div>
      </div>
    </div>
  );
};
export default ApiNode;
