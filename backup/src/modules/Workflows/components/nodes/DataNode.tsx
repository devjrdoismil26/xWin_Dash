import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Database, 
  Table, 
  FileText, 
  Image, 
  Video, 
  Mic,
  Download,
  Upload,
  RefreshCw,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Trash2,
  Edit,
  Plus,
  Save,
  Key,
  Lock,
  Unlock
} from 'lucide-react';
import { cn } from '@/lib/utils';
const DataNode = ({ data, isConnectable, selected }) => {
  const getDataIcon = (type) => {
    switch (type) {
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'table':
        return <Table className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'upload':
        return <Upload className="h-4 w-4" />;
      case 'sync':
        return <RefreshCw className="h-4 w-4" />;
      case 'search':
        return <Search className="h-4 w-4" />;
      case 'filter':
        return <Filter className="h-4 w-4" />;
      case 'sort':
        return <SortAsc className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
      case 'update':
        return <Edit className="h-4 w-4" />;
      case 'create':
        return <Plus className="h-4 w-4" />;
      case 'save':
        return <Save className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };
  const getDataColor = (type) => {
    switch (type) {
      case 'database':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'table':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'file':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'image':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'video':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'audio':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'download':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'upload':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'sync':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'search':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'filter':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'sort':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      case 'delete':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'update':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'create':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'save':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      default:
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
    }
  };
  const dataType = data?.dataType || 'database';
  const dataName = data?.name || 'Dados';
  const dataDescription = data?.description || 'Manipula dados';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getDataColor(dataType),
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
        <div className="workflow-node-icon bg-orange-500">
          {getDataIcon(dataType)}
        </div>
        <div className="workflow-node-title">
          {dataName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {dataDescription}
        </p>
        {data?.dataType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {dataType}
            </span>
          </div>
        )}
        {data?.table && (
          <div className="flex items-center gap-2 mb-2">
            <Table className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Tabela: {data.table}
            </span>
          </div>
        )}
        {data?.query && (
          <div className="flex items-center gap-2 mb-2">
            <Search className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              Query: {data.query}
            </span>
          </div>
        )}
        {data?.fields && data.fields.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Campos:</span>
            <div className="mt-1 space-y-1">
              {data.fields.slice(0, 2).map((field, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {field}
                </div>
              ))}
              {data.fields.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.fields.length - 2} mais...
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
        {data?.limit && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Limite:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.limit}
            </span>
          </div>
        )}
        {data?.offset && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Offset:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.offset}
            </span>
          </div>
        )}
        {data?.sortBy && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Ordenar por:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.sortBy}
            </span>
          </div>
        )}
        {data?.sortOrder && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Ordem:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.sortOrder}
            </span>
          </div>
        )}
        {data?.connection && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Conexão:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.connection}
            </span>
          </div>
        )}
        {data?.encrypted !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.encrypted ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.encrypted ? 'Criptografado' : 'Não Criptografado'}
            </span>
          </div>
        )}
        {data?.backup !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.backup ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.backup ? 'Backup Ativo' : 'Backup Inativo'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Database className="h-3 w-3 text-orange-600" />
          <span className="text-xs text-orange-600 font-medium">DADOS</span>
        </div>
      </div>
    </div>
  );
};
export default DataNode;
