import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Bot, 
  Brain, 
  MessageSquare, 
  FileText, 
  Image, 
  Video, 
  Mic,
  Code,
  Zap,
  Lightbulb,
  Target,
  TrendingUp,
  BarChart,
  Database,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
const AiNode = ({ data, isConnectable, selected }) => {
  const getAiIcon = (type) => {
    switch (type) {
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'text_generation':
        return <FileText className="h-4 w-4" />;
      case 'image_generation':
        return <Image className="h-4 w-4" />;
      case 'video_generation':
        return <Video className="h-4 w-4" />;
      case 'audio_generation':
        return <Mic className="h-4 w-4" />;
      case 'code_generation':
        return <Code className="h-4 w-4" />;
      case 'analysis':
        return <BarChart className="h-4 w-4" />;
      case 'prediction':
        return <TrendingUp className="h-4 w-4" />;
      case 'classification':
        return <Target className="h-4 w-4" />;
      case 'translation':
        return <Globe className="h-4 w-4" />;
      case 'summarization':
        return <Lightbulb className="h-4 w-4" />;
      default:
        return <Bot className="h-4 w-4" />;
    }
  };
  const getAiColor = (type) => {
    switch (type) {
      case 'chat':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'text_generation':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'image_generation':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'video_generation':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'audio_generation':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'code_generation':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'analysis':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'prediction':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'classification':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'translation':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'summarization':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      default:
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
    }
  };
  const aiType = data?.aiType || 'chat';
  const aiName = data?.name || 'IA';
  const aiDescription = data?.description || 'Processa dados com inteligência artificial';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAiColor(aiType),
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
        <div className="workflow-node-icon bg-indigo-500">
          {getAiIcon(aiType)}
        </div>
        <div className="workflow-node-title">
          {aiName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {aiDescription}
        </p>
        {data?.aiType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {aiType}
            </span>
          </div>
        )}
        {data?.model && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Modelo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.model}
            </span>
          </div>
        )}
        {data?.prompt && (
          <div className="flex items-center gap-2 mb-2">
            <Brain className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              {data.prompt}
            </span>
          </div>
        )}
        {data?.temperature && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Temperatura:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.temperature}
            </span>
          </div>
        )}
        {data?.maxTokens && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Max Tokens:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.maxTokens}
            </span>
          </div>
        )}
        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Parâmetros:</span>
            <div className="mt-1 space-y-1">
              {Object.entries(data.parameters).slice(0, 2).map(([key, value]) => (
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  <span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.parameters).length > 2 && (
                <div className="text-xs text-gray-500">
                  +{Object.keys(data.parameters).length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.confidence && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Confiança:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.confidence}%
            </span>
          </div>
        )}
        {data?.language && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Idioma:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.language}
            </span>
          </div>
        )}
        {data?.streaming !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.streaming ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.streaming ? 'Streaming ativo' : 'Streaming inativo'}
            </span>
          </div>
        )}
        {data?.cache !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.cache ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.cache ? 'Cache ativo' : 'Cache inativo'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Bot className="h-3 w-3 text-indigo-600" />
          <span className="text-xs text-indigo-600 font-medium">IA</span>
        </div>
      </div>
    </div>
  );
};
export default AiNode;
