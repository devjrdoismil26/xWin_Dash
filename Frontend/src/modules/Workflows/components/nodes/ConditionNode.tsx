import React from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch, Equal, X, ChevronRight, ChevronLeft, Search, XCircle, Circle, CheckCircle, FileText, Minus, Plus, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
const ConditionNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getConditionIcon = (operator: unknown) => {
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
    } ;

  const getConditionColor = (operator: unknown) => {
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
    } ;

  const conditionOperator = data?.operator || 'equals';
  const conditionName = data?.name || 'Condição';
  const conditionDescription = data?.description || 'Avalia uma condição';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getConditionColor(conditionOperator),
      selected && 'selected shadow-lg ring-2 ring-blue-500'
    )  }>
      </div><Handle
        type="target"
        position={ Position.Left }
        isConnectable={ isConnectable }
        className="workflow-node-handle target"
      / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
        id="true"
        style={top: '30%' } / />
      <Handle
        type="source"
        position={ Position.Right }
        isConnectable={ isConnectable }
        className="workflow-node-handle source"
        id="false"
        style={top: '70%' } / />
      <div className=" ">$2</div><div className="{getConditionIcon(conditionOperator)}">$2</div>
        </div>
        <div className="{conditionName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {conditionDescription}
        </p>
        {data?.variable && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Variável:</span>
            <span className="{data.variable}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.operator && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Operador:</span>
            <span className="{conditionOperator}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.value && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Valor:</span>
            <span className="{data.value}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.conditions && (data as any).conditions.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Condições:</span>
            <div className="{data.conditions.slice(0, 2).map((condition: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div>{condition.variable} {condition.operator} {condition.value}
                </div>
              ))}
              {data.conditions.length > 2 && (
                <div className="+{data.conditions.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.logicalOperator && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Lógica:</span>
            <span className="{data.logicalOperator.toUpperCase()}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.caseSensitive !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).caseSensitive ? 'bg-blue-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.caseSensitive ? 'Case Sensitive' : 'Case Insensitive'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><GitBranch className="h-3 w-3 text-yellow-600" />
            <span className="text-xs text-yellow-600 font-medium">CONDIÇÃO</span></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-xs text-green-600">TRUE</span></div><div className=" ">$2</div><div className=" ">$2</div><span className="text-xs text-red-600">FALSE</span></div></div>);};

export default ConditionNode;
