import React from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Table, FileText, Image, Video, Mic, Download, Upload, RefreshCw, Search, Filter, SortAsc, SortDesc, Trash2, Edit, Plus, Save, Key, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
const DataNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getDataIcon = (type: unknown) => {
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
    } ;

  const getDataColor = (type: unknown) => {
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
    } ;

  const dataType = data?.dataType || 'database';
  const dataName = data?.name || 'Dados';
  const dataDescription = data?.description || 'Manipula dados';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getDataColor(dataType),
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
      / />
      <div className=" ">$2</div><div className="{getDataIcon(dataType)}">$2</div>
        </div>
        <div className="{dataName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {dataDescription}
        </p>
        {data?.dataType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{dataType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.table && (
          <div className=" ">$2</div><Table className="h-3 w-3 text-gray-500" />
            <span className="Tabela: {data.table}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.query && (
          <div className=" ">$2</div><Search className="h-3 w-3 text-gray-500" />
            <span className="Query: {data.query}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.fields && (data as any).fields.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Campos:</span>
            <div className="{data.fields.slice(0, 2).map((field: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {field}
          </div>
              ))}
              {data.fields.length > 2 && (
                <div className="+{data.fields.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.conditions && (data as any).conditions.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Condições:</span>
            <div className="{data.conditions.slice(0, 2).map((condition: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {condition}
          </div>
              ))}
              {data.conditions.length > 2 && (
                <div className="+{data.conditions.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.limit && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Limite:</span>
            <span className="{data.limit}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.offset && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Offset:</span>
            <span className="{data.offset}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.sortBy && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Ordenar por:</span>
            <span className="{data.sortBy}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.sortOrder && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Ordem:</span>
            <span className="{data.sortOrder}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.connection && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Conexão:</span>
            <span className="{data.connection}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.encrypted !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).encrypted ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.encrypted ? 'Criptografado' : 'Não Criptografado'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.backup !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).backup ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.backup ? 'Backup Ativo' : 'Backup Inativo'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Database className="h-3 w-3 text-orange-600" />
          <span className="text-xs text-orange-600 font-medium">DADOS</span></div></div>);};

export default DataNode;
