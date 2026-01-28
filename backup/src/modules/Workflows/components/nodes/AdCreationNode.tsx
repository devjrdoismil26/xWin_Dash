import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Target, 
  Megaphone, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  MousePointer,
  BarChart,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Search,
  MessageSquare,
  Image,
  Video,
  FileText,
  Zap,
  Play,
  Pause,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
const AdCreationNode = ({ data, isConnectable, selected }) => {
  const getAdIcon = (type) => {
    switch (type) {
      case 'facebook':
        return <Globe className="h-4 w-4" />;
      case 'instagram':
        return <Image className="h-4 w-4" />;
      case 'google':
        return <Search className="h-4 w-4" />;
      case 'youtube':
        return <Video className="h-4 w-4" />;
      case 'linkedin':
        return <Users className="h-4 w-4" />;
      case 'twitter':
        return <MessageSquare className="h-4 w-4" />;
      case 'tiktok':
        return <Play className="h-4 w-4" />;
      case 'display':
        return <Monitor className="h-4 w-4" />;
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'carousel':
        return <BarChart className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };
  const getAdColor = (type) => {
    switch (type) {
      case 'facebook':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'instagram':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'google':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'youtube':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'linkedin':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'twitter':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'tiktok':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'display':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'mobile':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'video':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'image':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'carousel':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      default:
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
    }
  };
  const adType = data?.adType || 'display';
  const adName = data?.name || 'Anúncio';
  const adDescription = data?.description || 'Cria e gerencia anúncios';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAdColor(adType),
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
          {getAdIcon(adType)}
        </div>
        <div className="workflow-node-title">
          {adName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {adDescription}
        </p>
        {data?.adType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Plataforma:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {adType}
            </span>
          </div>
        )}
        {data?.campaignName && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Campanha:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.campaignName}
            </span>
          </div>
        )}
        {data?.budget && (
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Orçamento: R$ {data.budget}
            </span>
          </div>
        )}
        {data?.targetAudience && (
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Público: {data.targetAudience}
            </span>
          </div>
        )}
        {data?.adFormat && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Formato:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.adFormat}
            </span>
          </div>
        )}
        {data?.creative && (
          <div className="flex items-center gap-2 mb-2">
            <Image className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              Criativo: {data.creative}
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
        {data?.bidding && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Lance:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.bidding}
            </span>
          </div>
        )}
        {data?.keywords && data.keywords.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Palavras-chave:</span>
            <div className="mt-1 space-y-1">
              {data.keywords.slice(0, 2).map((keyword, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {keyword}
                </div>
              ))}
              {data.keywords.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.keywords.length - 2} mais...
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
        {data?.status && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.status === 'active' && 'bg-green-100 text-green-800',
              data.status === 'paused' && 'bg-yellow-100 text-yellow-800',
              data.status === 'draft' && 'bg-gray-100 text-gray-800',
              data.status === 'rejected' && 'bg-red-100 text-red-800'
            )}>
              {data.status}
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
          <Target className="h-3 w-3 text-orange-600" />
          <span className="text-xs text-orange-600 font-medium">ANÚNCIO</span>
        </div>
      </div>
    </div>
  );
};
export default AdCreationNode;
