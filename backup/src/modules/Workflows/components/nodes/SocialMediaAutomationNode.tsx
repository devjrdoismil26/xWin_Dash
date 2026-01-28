import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Share2,
  Repeat, 
  Users, 
  Heart, 
  MessageCircle, 
  Repeat, 
  Bookmark,
  Eye,
  MousePointer,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Globe,
  Smartphone,
  Monitor,
  Image,
  Video,
  FileText,
  Link,
  Hash,
  AtSign,
  Calendar,
  Clock,
  Zap,
  Settings,
  Play,
  Pause,
  Square,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
const SocialMediaAutomationNode = ({ data, isConnectable, selected }) => {
  const getAutomationIcon = (type) => {
    switch (type) {
      case 'post':
        return <Share2 className="h-4 w-4" />;
      case 'engage':
        return <Heart className="h-4 w-4" />;
      case 'respond':
        return <MessageCircle className="h-4 w-4" />;
      case 'follow':
        return <Users className="h-4 w-4" />;
      case 'unfollow':
        return <Users className="h-4 w-4" />;
      case 'like':
        return <Heart className="h-4 w-4" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4" />;
      case 'share':
        return <Repeat className="h-4 w-4" />;
      case 'bookmark':
        return <Bookmark className="h-4 w-4" />;
      case 'monitor':
        return <Eye className="h-4 w-4" />;
      case 'analyze':
        return <BarChart className="h-4 w-4" />;
      case 'schedule':
        return <Calendar className="h-4 w-4" />;
      case 'cross_post':
        return <Globe className="h-4 w-4" />;
      case 'hashtag':
        return <Hash className="h-4 w-4" />;
      case 'mention':
        return <AtSign className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };
  const getAutomationColor = (type) => {
    switch (type) {
      case 'post':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'engage':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'respond':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'follow':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'unfollow':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'like':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'comment':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'share':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'bookmark':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'monitor':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'analyze':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'schedule':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      case 'cross_post':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'hashtag':
        return 'border-rose-300 bg-gradient-to-br from-rose-50 to-rose-100';
      case 'mention':
        return 'border-violet-300 bg-gradient-to-br from-violet-50 to-violet-100';
      default:
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
    }
  };
  const automationType = data?.automationType || 'post';
  const automationName = data?.name || 'Automação Social';
  const automationDescription = data?.description || 'Automatiza ações em redes sociais';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAutomationColor(automationType),
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
        <div className="workflow-node-icon bg-gray-500">
          {getAutomationIcon(automationType)}
        </div>
        <div className="workflow-node-title">
          {automationName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {automationDescription}
        </p>
        {data?.automationType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {automationType}
            </span>
          </div>
        )}
        {data?.platforms && data.platforms.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Plataformas:</span>
            <div className="mt-1 space-y-1">
              {data.platforms.slice(0, 2).map((platform, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {platform}
                </div>
              ))}
              {data.platforms.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.platforms.length - 2} mais...
                </div>
              )}
            </div>
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
        {data?.schedule && (
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {data.schedule}
            </span>
          </div>
        )}
        {data?.frequency && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Frequência: {data.frequency}
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
        {data?.hashtags && data.hashtags.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Hashtags:</span>
            <div className="mt-1 space-y-1">
              {data.hashtags.slice(0, 2).map((hashtag, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  #{hashtag}
                </div>
              ))}
              {data.hashtags.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.hashtags.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.mentions && data.mentions.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Menções:</span>
            <div className="mt-1 space-y-1">
              {data.mentions.slice(0, 2).map((mention, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  @{mention}
                </div>
              ))}
              {data.mentions.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.mentions.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.content && (
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              {data.content}
            </span>
          </div>
        )}
        {data?.media && data.media.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Mídia:</span>
            <div className="mt-1 space-y-1">
              {data.media.slice(0, 2).map((item, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1 flex items-center gap-1">
                  {item.type === 'image' && <Image className="h-3 w-3" />}
                  {item.type === 'video' && <Video className="h-3 w-3" />}
                  {item.type === 'link' && <Link className="h-3 w-3" />}
                  {item.name}
                </div>
              ))}
              {data.media.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.media.length - 2} mais...
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
              data.status === 'completed' && 'bg-blue-100 text-blue-800',
              data.status === 'failed' && 'bg-red-100 text-red-800'
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
        {data?.crossPost !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.crossPost ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.crossPost ? 'Cross-posting Ativo' : 'Cross-posting Inativo'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Share2 className="h-3 w-3 text-gray-600" />
          <span className="text-xs text-gray-600 font-medium">AUTOMAÇÃO</span>
        </div>
      </div>
    </div>
  );
};
export default SocialMediaAutomationNode;
