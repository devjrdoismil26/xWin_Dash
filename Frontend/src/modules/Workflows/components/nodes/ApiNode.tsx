import React from 'react';
import { Handle, Position } from 'reactflow';
import { Code, Globe, Database, Key, Lock, Unlock, ArrowRight, ArrowLeft, RefreshCw, Clock, CheckCircle, AlertCircle, FileText, Image, Video, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
const ApiNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getApiIcon = (method: unknown) => {
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
    } ;

  const getApiColor = (method: unknown) => {
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
    } ;

  const apiMethod = data?.method || 'GET';
  const apiName = data?.name || 'API';
  const apiDescription = data?.description || 'Faz uma chamada para API';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getApiColor(apiMethod),
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
      <div className=" ">$2</div><div className="{getApiIcon(apiMethod)}">$2</div>
        </div>
        <div className="{apiName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {apiDescription}
        </p>
        { data?.method && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Método:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full font-medium',
              apiMethod.toUpperCase() === 'GET' && 'bg-green-100 text-green-800',
              apiMethod.toUpperCase() === 'POST' && 'bg-blue-100 text-blue-800',
              apiMethod.toUpperCase() === 'PUT' && 'bg-yellow-100 text-yellow-800',
              apiMethod.toUpperCase() === 'DELETE' && 'bg-red-100 text-red-800',
              apiMethod.toUpperCase() === 'PATCH' && 'bg-purple-100 text-purple-800'
            )  }>
        </span>{apiMethod.toUpperCase()}
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
        {data?.endpoint && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Endpoint:</span>
            <span className="{data.endpoint}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.authType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Auth:</span>
            <span className="{data.authType}">$2</span>
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
        { data?.followRedirects !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).followRedirects ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.followRedirects ? 'Seguir Redirects' : 'Não Seguir Redirects'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Code className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">API</span></div></div>);};

export default ApiNode;
