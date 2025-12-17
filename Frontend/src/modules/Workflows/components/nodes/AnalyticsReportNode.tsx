import React from 'react';
import { Handle, Position } from 'reactflow';
import { BarChart, PieChart, LineChart, TrendingUp, TrendingDown, Activity, Eye, MousePointer, Users, Clock, DollarSign, Target, Globe, Smartphone, CheckCircle, XCircle, AlertTriangle, FileText, Download, Share2, Calendar, Filter, Search, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
const AnalyticsReportNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getReportIcon = (type: unknown) => {
    switch (type) {
      case 'performance':
        return <TrendingUp className="h-4 w-4" />;
      case 'conversion':
        return <Target className="h-4 w-4" />;
      case 'traffic':
        return <Activity className="h-4 w-4" />;
      case 'revenue':
        return <DollarSign className="h-4 w-4" />;
      case 'engagement':
        return <Users className="h-4 w-4" />;
      case 'behavior':
        return <MousePointer className="h-4 w-4" />;
      case 'demographics':
        return <Users className="h-4 w-4" />;
      case 'geographic':
        return <Globe className="h-4 w-4" />;
      case 'device':
        return <Smartphone className="h-4 w-4" />;
      case 'custom':
        return <BarChart className="h-4 w-4" />;
      case 'real_time':
        return <Zap className="h-4 w-4" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <BarChart className="h-4 w-4" />;
    } ;

  const getReportColor = (type: unknown) => {
    switch (type) {
      case 'performance':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'conversion':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'traffic':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'revenue':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'engagement':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'behavior':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'demographics':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'geographic':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'device':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'custom':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'real_time':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'scheduled':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      default:
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
    } ;

  const reportType = data?.reportType || 'performance';
  const reportName = data?.name || 'Relatório';
  const reportDescription = data?.description || 'Gera relatório de analytics';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getReportColor(reportType),
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
      <div className=" ">$2</div><div className="{getReportIcon(reportType)}">$2</div>
        </div>
        <div className="{reportName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {reportDescription}
        </p>
        {data?.reportType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{reportType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.period && (
          <div className=" ">$2</div><Calendar className="h-3 w-3 text-gray-500" />
            <span className="Período: {data.period}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.metrics && (data as any).metrics.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Métricas:</span>
            <div className="{data.metrics.slice(0, 2).map((metric: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {metric}
          </div>
              ))}
              {data.metrics.length > 2 && (
                <div className="+{data.metrics.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.filters && Object.keys(data.filters).length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Filtros:</span>
            <div className="{Object.entries(data.filters).slice(0, 2).map(([key, value]) => (">$2</div>
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div><span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.filters).length > 2 && (
                <div className="+{Object.keys(data.filters).length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.format && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Formato:</span>
            <span className="{data.format}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.schedule && (
          <div className=" ">$2</div><Clock className="h-3 w-3 text-gray-500" />
            <span className="{data.schedule}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.recipients && (data as any).recipients.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Destinatários:</span>
            <div className="{data.recipients.slice(0, 2).map((recipient: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {recipient}
          </div>
              ))}
              {data.recipients.length > 2 && (
                <div className="+{data.recipients.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.thresholds && Object.keys(data.thresholds).length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Limites:</span>
            <div className="{Object.entries(data.thresholds).slice(0, 2).map(([key, value]) => (">$2</div>
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div><span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.thresholds).length > 2 && (
                <div className="+{Object.keys(data.thresholds).length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        { data?.status && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).status === 'active' && 'bg-green-100 text-green-800',
              (data as any).status === 'paused' && 'bg-yellow-100 text-yellow-800',
              (data as any).status === 'draft' && 'bg-gray-100 text-gray-800',
              (data as any).status === 'error' && 'bg-red-100 text-red-800'
            )  }>
        </span>{data.status}
            </span>
      </div>
    </>
  )}
        { data?.realTime !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).realTime ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.realTime ? 'Tempo Real' : 'Histórico'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.autoSend !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).autoSend ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.autoSend ? 'Envio Automático' : 'Envio Manual'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><BarChart className="h-3 w-3 text-blue-600" />
          <span className="text-xs text-blue-600 font-medium">RELATÓRIO</span></div></div>);};

export default AnalyticsReportNode;
