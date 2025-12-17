import React from 'react';
import { Handle, Position } from 'reactflow';
import { Settings, Mail, MessageSquare, Database, Globe, Smartphone, FileText, User, Send, Save, Download, Upload, Code, Zap, Bot, BarChart, Camera, Mic, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
const ActionNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getActionIcon = (type: unknown) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />;
      case 'webhook':
        return <Globe className="h-4 w-4" />;
      case 'database':
        return <Database className="h-4 w-4" />;
      case 'api':
        return <Code className="h-4 w-4" />;
      case 'ai':
        return <Bot className="h-4 w-4" />;
      case 'analytics':
        return <BarChart className="h-4 w-4" />;
      case 'file':
        return <FileText className="h-4 w-4" />;
      case 'user':
        return <User className="h-4 w-4" />;
      case 'send':
        return <Send className="h-4 w-4" />;
      case 'save':
        return <Save className="h-4 w-4" />;
      case 'download':
        return <Download className="h-4 w-4" />;
      case 'upload':
        return <Upload className="h-4 w-4" />;
      case 'camera':
        return <Camera className="h-4 w-4" />;
      case 'mic':
        return <Mic className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    } ;

  const getActionColor = (type: unknown) => {
    switch (type) {
      case 'email':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'whatsapp':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'webhook':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'database':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'api':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'ai':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'analytics':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'file':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'user':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'send':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'save':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'download':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'upload':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'camera':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'mic':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'video':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
    } ;

  const actionType = data?.actionType || 'settings';
  const actionName = data?.name || 'Ação';
  const actionDescription = data?.description || 'Executa uma ação';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getActionColor(actionType),
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
      <div className=" ">$2</div><div className="{getActionIcon(actionType)}">$2</div>
        </div>
        <div className="{actionName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {actionDescription}
        </p>
        {data?.actionType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{actionType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Parâmetros:</span>
            <div className="{Object.entries(data.parameters).slice(0, 2).map(([key, value]) => (">$2</div>
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div><span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.parameters).length > 2 && (
                <div className="+{Object.keys(data.parameters).length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.timeout && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Timeout:</span>
            <span className="{data.timeout}s">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.retryCount && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tentativas:</span>
            <span className="{data.retryCount}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.isAsync !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).isAsync ? 'bg-blue-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.isAsync ? 'Assíncrono' : 'Síncrono'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Settings className="h-3 w-3 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">AÇÃO</span></div></div>);};

export default ActionNode;
