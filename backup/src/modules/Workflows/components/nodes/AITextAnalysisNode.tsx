import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Brain, 
  FileText, 
  MessageSquare, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Smile,
  Frown,
  Meh,
  AlertTriangle,
  CheckCircle,
  Globe,
  Target,
  XCircle,
  BarChart,
  PieChart,
  Hash,
  Tag,
  Eye,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
const AITextAnalysisNode = ({ data, isConnectable, selected }) => {
  const getAnalysisIcon = (type) => {
    switch (type) {
      case 'sentiment':
        return <Smile className="h-4 w-4" />;
      case 'emotion':
        return <Frown className="h-4 w-4" />;
      case 'keywords':
        return <Hash className="h-4 w-4" />;
      case 'entities':
        return <Tag className="h-4 w-4" />;
      case 'topics':
        return <PieChart className="h-4 w-4" />;
      case 'language':
        return <Globe className="h-4 w-4" />;
      case 'classification':
        return <BarChart className="h-4 w-4" />;
      case 'summarization':
        return <FileText className="h-4 w-4" />;
      case 'translation':
        return <MessageSquare className="h-4 w-4" />;
      case 'moderation':
        return <AlertTriangle className="h-4 w-4" />;
      case 'intent':
        return <Target className="h-4 w-4" />;
      case 'quality':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };
  const getAnalysisColor = (type) => {
    switch (type) {
      case 'sentiment':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'emotion':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'keywords':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'entities':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'topics':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'language':
        return 'border-cyan-300 bg-gradient-to-br from-cyan-50 to-cyan-100';
      case 'classification':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'summarization':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'translation':
        return 'border-teal-300 bg-gradient-to-br from-teal-50 to-teal-100';
      case 'moderation':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      case 'intent':
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
      case 'quality':
        return 'border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100';
      default:
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
    }
  };
  const analysisType = data?.analysisType || 'sentiment';
  const analysisName = data?.name || 'Análise de Texto';
  const analysisDescription = data?.description || 'Analisa texto com IA';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAnalysisColor(analysisType),
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
          {getAnalysisIcon(analysisType)}
        </div>
        <div className="workflow-node-title">
          {analysisName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {analysisDescription}
        </p>
        {data?.analysisType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {analysisType}
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
        {data?.language && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Idioma:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.language}
            </span>
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
        {data?.sentiment && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Sentimento:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.sentiment === 'positive' && 'bg-green-100 text-green-800',
              data.sentiment === 'negative' && 'bg-red-100 text-red-800',
              data.sentiment === 'neutral' && 'bg-gray-100 text-gray-800'
            )}>
              {data.sentiment}
            </span>
          </div>
        )}
        {data?.emotions && data.emotions.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Emoções:</span>
            <div className="mt-1 space-y-1">
              {data.emotions.slice(0, 2).map((emotion, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {emotion}
                </div>
              ))}
              {data.emotions.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.emotions.length - 2} mais...
                </div>
              )}
            </div>
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
        {data?.entities && data.entities.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Entidades:</span>
            <div className="mt-1 space-y-1">
              {data.entities.slice(0, 2).map((entity, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {entity}
                </div>
              ))}
              {data.entities.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.entities.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.topics && data.topics.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Tópicos:</span>
            <div className="mt-1 space-y-1">
              {data.topics.slice(0, 2).map((topic, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                  {topic}
                </div>
              ))}
              {data.topics.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.topics.length - 2} mais...
                </div>
              )}
            </div>
          </div>
        )}
        {data?.score && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Score:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.score}
            </span>
          </div>
        )}
        {data?.moderation && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Moderação:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.moderation === 'safe' && 'bg-green-100 text-green-800',
              data.moderation === 'unsafe' && 'bg-red-100 text-red-800',
              data.moderation === 'warning' && 'bg-yellow-100 text-yellow-800'
            )}>
              {data.moderation}
            </span>
          </div>
        )}
        {data?.intent && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Intenção:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.intent}
            </span>
          </div>
        )}
        {data?.quality && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Qualidade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              data.quality === 'high' && 'bg-green-100 text-green-800',
              data.quality === 'medium' && 'bg-yellow-100 text-yellow-800',
              data.quality === 'low' && 'bg-red-100 text-red-800'
            )}>
              {data.quality}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Brain className="h-3 w-3 text-indigo-600" />
          <span className="text-xs text-indigo-600 font-medium">ANÁLISE IA</span>
        </div>
      </div>
    </div>
  );
};
export default AITextAnalysisNode;
