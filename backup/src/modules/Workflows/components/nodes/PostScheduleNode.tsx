import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Calendar, 
  Clock, 
  Send, 
  Users, 
  Globe,
  Smartphone,
  Monitor,
  Image,
  Video,
  FileText,
  Link,
  Hash,
  AtSign,
  TrendingUp,
  BarChart,
  Eye,
  MousePointer,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Settings,
  Play,
  Pause,
  Square,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
const PostScheduleNode = ({ data, isConnectable, selected }) => {
  const getPostIcon = (type) => {
    switch (type) {
      case 'facebook':
        return <Globe className="h-4 w-4" />;
      case 'instagram':
        return <Image className="h-4 w-4" />;
      case 'twitter':
        return <MessageCircle className="h-4 w-4" />;
      case 'linkedin':
        return <Users className="h-4 w-4" />;
      case 'youtube':
        return <Video className="h-4 w-4" />;
      case 'tiktok':
        return <Play className="h-4 w-4" />;
      case 'pinterest':
        return <Image className="h-4 w-4" />;
      case 'blog':
        return <FileText className="h-4 w-4" />;
      case 'email':
        return <Send className="h-4 w-4" />;
      case 'sms':
        return <MessageCircle className="h-4 w-4" />;
      case 'whatsapp':
        return <MessageCircle className="h-4 w-4" />;
      case 'telegram':
        return <MessageCircle className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };
  const getPostColor = (type) => {
    switch (type) {
      case 'facebook':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'instagram':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'twitter':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'linkedin':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'youtube':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'tiktok':
        return 'border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100';
      case 'pinterest':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'blog':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'email':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'sms':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'whatsapp':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'telegram':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      default:
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
    }
  };
  const postType = data?.postType || 'facebook';
  const postName = data?.name || 'Agendamento de Post';
  const postDescription = data?.description || 'Agenda posts para redes sociais';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getPostColor(postType),
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
        <div className="workflow-node-icon bg-yellow-500">
          {getPostIcon(postType)}
        </div>
        <div className="workflow-node-title">
          {postName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {postDescription}
        </p>
        {data?.postType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Plataforma:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {postType}
            </span>
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
        {data?.schedule && (
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {data.schedule}
            </span>
          </div>
        )}
        {data?.timezone && (
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              {data.timezone}
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
        {data?.audience && (
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600">
              Público: {data.audience}
            </span>
          </div>
        )}
        {data?.location && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Localização:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.location}
            </span>
          </div>
        )}
        {data?.status && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.status === 'scheduled' && 'bg-blue-100 text-blue-800',
              data.status === 'published' && 'bg-green-100 text-green-800',
              data.status === 'failed' && 'bg-red-100 text-red-800',
              data.status === 'draft' && 'bg-gray-100 text-gray-800',
              data.status === 'cancelled' && 'bg-yellow-100 text-yellow-800'
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
          <Calendar className="h-3 w-3 text-yellow-600" />
          <span className="text-xs text-yellow-600 font-medium">AGENDAMENTO</span>
        </div>
      </div>
    </div>
  );
};
export default PostScheduleNode;
