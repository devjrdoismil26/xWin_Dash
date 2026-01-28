import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Mail,
  ShoppingCart,
  Gift,
  Package, 
  Send, 
  Users, 
  Target, 
  Calendar, 
  Clock,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Image,
  Link,
  BarChart,
  PieChart,
  Zap,
  Settings,
  Play,
  Pause,
  Square
} from 'lucide-react';
import { cn } from '@/lib/utils';
const EmailCampaignNode = ({ data, isConnectable, selected }) => {
  const getCampaignIcon = (type) => {
    switch (type) {
      case 'newsletter':
        return <FileText className="h-4 w-4" />;
      case 'promotional':
        return <TrendingUp className="h-4 w-4" />;
      case 'transactional':
        return <CheckCircle className="h-4 w-4" />;
      case 'welcome':
        return <Users className="h-4 w-4" />;
      case 'abandoned_cart':
        return <ShoppingCart className="h-4 w-4" />;
      case 'follow_up':
        return <Clock className="h-4 w-4" />;
      case 're_engagement':
        return <Zap className="h-4 w-4" />;
      case 'birthday':
        return <Gift className="h-4 w-4" />;
      case 'anniversary':
        return <Calendar className="h-4 w-4" />;
      case 'survey':
        return <BarChart className="h-4 w-4" />;
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'product_update':
        return <Package className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  const getCampaignColor = (type) => {
    switch (type) {
      case 'newsletter':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'promotional':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'transactional':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'welcome':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'abandoned_cart':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'follow_up':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 're_engagement':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'birthday':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'anniversary':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'survey':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'event':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      case 'product_update':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      default:
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
    }
  };
  const campaignType = data?.campaignType || 'newsletter';
  const campaignName = data?.name || 'Campanha de Email';
  const campaignDescription = data?.description || 'Gerencia campanha de email';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getCampaignColor(campaignType),
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
        <div className="workflow-node-icon bg-purple-500">
          {getCampaignIcon(campaignType)}
        </div>
        <div className="workflow-node-title">
          {campaignName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {campaignDescription}
        </p>
        {data?.campaignType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {campaignType}
            </span>
          </div>
        )}
        {data?.subject && (
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              {data.subject}
            </span>
          </div>
        )}
        {data?.audience && (
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Público: {data.audience}
            </span>
          </div>
        )}
        {data?.template && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Template:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.template}
            </span>
          </div>
        )}
        {data?.schedule && (
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {data.schedule}
            </span>
          </div>
        )}
        {data?.segments && data.segments.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Segmentos:</span>
            <div className="mt-1 space-y-1">
              {data.segments.slice(0, 2).map((segment, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {segment}
                </div>
              ))}
              {data.segments.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.segments.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.metrics && Object.keys(data.metrics).length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Métricas:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(data.metrics).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.metrics).length > 2 && (
                <div className="text-xs text-gray-500">
                  +{Object.keys(data.metrics).length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.personalization && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Personalização:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.personalization}
            </span>
          </div>
        )}
        {data?.a_b_test && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">A/B Test:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.a_b_test}
            </span>
          </div>
        )}
        {data?.status && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.status === 'active' && 'bg-green-100 text-green-800',
              data.status === 'paused' && 'bg-yellow-100 text-yellow-800',
              data.status === 'draft' && 'bg-gray-100 text-gray-800',
              data.status === 'completed' && 'bg-blue-100 text-blue-800',
              data.status === 'cancelled' && 'bg-red-100 text-red-800'
            )}>
              {data.status}
            </span>
          </div>
        )}
        {data?.priority && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Prioridade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.priority === 'high' && 'bg-red-100 text-red-800',
              data.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
              data.priority === 'low' && 'bg-green-100 text-green-800'
            )}>
              {data.priority}
            </span>
          </div>
        )}
        {data?.tracking !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.tracking ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.tracking ? 'Rastreamento Ativo' : 'Rastreamento Inativo'}
            </span>
          </div>
        )}
        {data?.autoOptimize !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.autoOptimize ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.autoOptimize ? 'Otimização Automática' : 'Otimização Manual'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-purple-600" />
          <span className="text-xs text-purple-600 font-medium">CAMPANHA</span>
        </div>
      </div>
    </div>
  );
};
export default EmailCampaignNode;
