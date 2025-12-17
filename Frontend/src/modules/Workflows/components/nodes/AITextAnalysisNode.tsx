import React from 'react';
import { Handle, Position } from 'reactflow';
import { Brain, FileText, MessageSquare, Search, Filter, TrendingUp, TrendingDown, Smile, Frown, Meh, AlertTriangle, CheckCircle, Globe, Target, XCircle, BarChart, PieChart, Hash, Tag, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
const AITextAnalysisNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getAnalysisIcon = (type: unknown) => {
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
    } ;

  const getAnalysisColor = (type: unknown) => {
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
    } ;

  const analysisType = data?.analysisType || 'sentiment';
  const analysisName = data?.name || 'Análise de Texto';
  const analysisDescription = data?.description || 'Analisa texto com IA';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAnalysisColor(analysisType),
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
      <div className=" ">$2</div><div className="{getAnalysisIcon(analysisType)}">$2</div>
        </div>
        <div className="{analysisName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {analysisDescription}
        </p>
        {data?.analysisType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{analysisType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.model && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Modelo:</span>
            <span className="{data.model}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.language && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Idioma:</span>
            <span className="{data.language}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.confidence && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Confiança:</span>
            <span className="{data.confidence}%">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.sentiment && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Sentimento:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).sentiment === 'positive' && 'bg-green-100 text-green-800',
              (data as any).sentiment === 'negative' && 'bg-red-100 text-red-800',
              (data as any).sentiment === 'neutral' && 'bg-gray-100 text-gray-800'
            )  }>
        </span>{data.sentiment}
            </span>
      </div>
    </>
  )}
        {data?.emotions && (data as any).emotions.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Emoções:</span>
            <div className="{data.emotions.slice(0, 2).map((emotion: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {emotion}
          </div>
              ))}
              {data.emotions.length > 2 && (
                <div className="+{data.emotions.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.keywords && (data as any).keywords.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Palavras-chave:</span>
            <div className="{data.keywords.slice(0, 2).map((keyword: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {keyword}
          </div>
              ))}
              {data.keywords.length > 2 && (
                <div className="+{data.keywords.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.entities && (data as any).entities.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Entidades:</span>
            <div className="{data.entities.slice(0, 2).map((entity: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {entity}
          </div>
              ))}
              {data.entities.length > 2 && (
                <div className="+{data.entities.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.topics && (data as any).topics.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tópicos:</span>
            <div className="{data.topics.slice(0, 2).map((topic: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {topic}
          </div>
              ))}
              {data.topics.length > 2 && (
                <div className="+{data.topics.length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.score && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Score:</span>
            <span className="{data.score}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.moderation && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Moderação:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).moderation === 'safe' && 'bg-green-100 text-green-800',
              (data as any).moderation === 'unsafe' && 'bg-red-100 text-red-800',
              (data as any).moderation === 'warning' && 'bg-yellow-100 text-yellow-800'
            )  }>
        </span>{data.moderation}
            </span>
      </div>
    </>
  )}
        {data?.intent && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Intenção:</span>
            <span className="{data.intent}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.quality && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Qualidade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).quality === 'high' && 'bg-green-100 text-green-800',
              (data as any).quality === 'medium' && 'bg-yellow-100 text-yellow-800',
              (data as any).quality === 'low' && 'bg-red-100 text-red-800'
            )  }>
        </span>{data.quality}
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Brain className="h-3 w-3 text-indigo-600" />
          <span className="text-xs text-indigo-600 font-medium">ANÁLISE IA</span></div></div>);};

export default AITextAnalysisNode;
