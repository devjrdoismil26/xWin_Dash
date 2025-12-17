import React from 'react';
import { Handle, Position } from 'reactflow';
import { Globe, Webhook, ArrowRight, ArrowLeft, Key, Lock, Unlock, Clock, CheckCircle, AlertCircle, FileText, Image, Video, Mic, Database, Code, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
const WebhookNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getWebhookIcon = (type: unknown) => {
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
    } ;

  const getWebhookColor = (type: unknown) => {
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
    } ;

  const webhookType = data?.webhookType || 'incoming';
  const webhookName = data?.name || 'Webhook';
  const webhookDescription = data?.description || 'Processa webhook';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getWebhookColor(webhookType),
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
      <div className=" ">$2</div><div className="{getWebhookIcon(webhookType)}">$2</div>
        </div>
        <div className="{webhookName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {webhookDescription}
        </p>
        {data?.webhookType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{webhookType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.url && (
          <div className=" ">$2</div><Globe className="h-3 w-3 text-gray-500" />
            <span className="{data.url}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.method && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Método:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full font-medium',
              (data as any).method.toUpperCase() === 'GET' && 'bg-green-100 text-green-800',
              (data as any).method.toUpperCase() === 'POST' && 'bg-blue-100 text-blue-800',
              (data as any).method.toUpperCase() === 'PUT' && 'bg-yellow-100 text-yellow-800',
              (data as any).method.toUpperCase() === 'DELETE' && 'bg-red-100 text-red-800'
            )  }>
        </span>{data.method.toUpperCase()}
            </span>
      </div>
    </>
  )}
        {data?.secret && (
          <div className=" ">$2</div><Key className="h-3 w-3 text-gray-500" />
            <span className="Secret: {data.secret ? '***' : 'Não definido'}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.headers && Object.keys(data.headers).length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Headers:</span>
            <div className="{Object.entries(data.headers).slice(0, 2).map(([key, value]) => (">$2</div>
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div><span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.headers).length > 2 && (
                <div className="+{Object.keys(data.headers).length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.body && (
          <div className=" ">$2</div><FileText className="h-3 w-3 text-gray-500" />
            <span className="Body: {typeof (data as any).body === 'string' ? (data as any).body : 'JSON'}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.timeout && (
          <div className=" ">$2</div><Clock className="h-3 w-3 text-gray-500" />
            <span className="Timeout: {data.timeout}s">$2</span>
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
        {data?.expectedStatus && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Status:</span>
            <span className="{data.expectedStatus}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.authentication && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Auth:</span>
            <span className="{data.authentication}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.sslVerify !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).sslVerify ? 'bg-green-500' : 'bg-red-500'
            )  }>
        </div><span className="{data.sslVerify ? 'SSL Verificado' : 'SSL Não Verificado'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.active !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).active ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.active ? 'Ativo' : 'Inativo'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Globe className="h-3 w-3 text-green-600" />
          <span className="text-xs text-green-600 font-medium">WEBHOOK</span></div></div>);};

export default WebhookNode;
