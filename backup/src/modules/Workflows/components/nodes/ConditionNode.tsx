import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  GitBranch, 
  Equal, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  XCircle,
  Circle,
  CheckCircle,
  FileText,
  Minus,
  Plus,
  Hash
} from 'lucide-react';
import { cn } from '@/lib/utils';
const ConditionNode = ({ data, isConnectable, selected }) => {
  const getConditionIcon = (operator) => {
    switch (operator) {
      case 'equals':
        return <Equal className="h-4 w-4" />;
      case 'not_equals':
        return <X className="h-4 w-4" />;
      case 'greater_than':
        return <ChevronRight className="h-4 w-4" />;
      case 'less_than':
        return <ChevronLeft className="h-4 w-4" />;
      case 'contains':
        return <Search className="h-4 w-4" />;
      case 'not_contains':
        return <XCircle className="h-4 w-4" />;
      case 'is_empty':
        return <Circle className="h-4 w-4" />;
      case 'is_not_empty':
        return <CheckCircle className="h-4 w-4" />;
      case 'regex':
        return <FileText className="h-4 w-4" />;
      case 'between':
        return <Minus className="h-4 w-4" />;
      case 'in':
        return <Plus className="h-4 w-4" />;
      case 'not_in':
        return <Hash className="h-4 w-4" />;
      default:
        return <GitBranch className="h-4 w-4" />;
    }
  };
  const getConditionColor = (operator) => {
    switch (operator) {
      case 'equals':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'not_equals':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'greater_than':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'less_than':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'contains':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'not_contains':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'is_empty':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'is_not_empty':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'regex':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'between':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'in':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'not_in':
        return 'border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100';
      default:
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
    }
  };
  const conditionOperator = data?.operator || 'equals';
  const conditionName = data?.name || 'Condição';
  const conditionDescription = data?.description || 'Avalia uma condição';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getConditionColor(conditionOperator),
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
        id="true"
        style={{ top: '30%' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="workflow-node-handle source"
        id="false"
        style={{ top: '70%' }}
      />
      <div className="workflow-node-header">
        <div className="workflow-node-icon bg-yellow-500">
          {getConditionIcon(conditionOperator)}
        </div>
        <div className="workflow-node-title">
          {conditionName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {conditionDescription}
        </p>
        {data?.variable && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Variável:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.variable}
            </span>
          </div>
        )}
        {data?.operator && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Operador:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {conditionOperator}
            </span>
          </div>
        )}
        {data?.value && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Valor:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.value}
            </span>
          </div>
        )}
        {data?.conditions && data.conditions.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Condições:</span>
            <div className="mt-1 space-y-1">
              {data.conditions.slice(0, 2).map((condition, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {condition.variable} {condition.operator} {condition.value}
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
        {data?.logicalOperator && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Lógica:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.logicalOperator.toUpperCase()}
            </span>
          </div>
        )}
        {data?.caseSensitive !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.caseSensitive ? 'bg-blue-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.caseSensitive ? 'Case Sensitive' : 'Case Insensitive'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">CONDIÇÃO</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-xs text-green-600">TRUE</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-1 mt-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-xs text-red-600">FALSE</span>
        </div>
      </div>
    </div>
  );
};
export default ConditionNode;
