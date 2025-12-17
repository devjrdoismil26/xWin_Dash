import React from 'react';
import { Handle, Position } from 'reactflow';
import { Bot, Brain, MessageSquare, FileText, Image, Video, Mic, Code, Zap, Lightbulb, Target, TrendingUp, BarChart, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
const AiNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getAiIcon = (type: unknown) => {
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
    } ;

  const getAiColor = (type: unknown) => {
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
    } ;

  const aiType = data?.aiType || 'chat';
  const aiName = data?.name || 'IA';
  const aiDescription = data?.description || 'Processa dados com inteligência artificial';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAiColor(aiType),
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
      <div className=" ">$2</div><div className="{getAiIcon(aiType)}">$2</div>
        </div>
        <div className="{aiName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {aiDescription}
        </p>
        {data?.aiType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{aiType}">$2</span>
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
        {data?.prompt && (
          <div className=" ">$2</div><Brain className="h-3 w-3 text-gray-500" />
            <span className="{data.prompt}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.temperature && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Temperatura:</span>
            <span className="{data.temperature}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.maxTokens && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Max Tokens:</span>
            <span className="{data.maxTokens}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.parameters && Object.keys(data.parameters).length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Parâmetros:</span>
            <div className="{Object.entries(data.parameters).slice(0, 2).map(([key, value]) => (">$2</div>
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div><span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.parameters).length > 2 && (
                <div className="+{Object.keys(data.parameters).length - 2} mais...">$2</div>
    </div>
  )}
            </div>
        )}
        {data?.confidence && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Confiança:</span>
            <span className="{data.confidence}%">$2</span>
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
        { data?.streaming !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).streaming ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.streaming ? 'Streaming ativo' : 'Streaming inativo'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.cache !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).cache ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.cache ? 'Cache ativo' : 'Cache inativo'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Bot className="h-3 w-3 text-indigo-600" />
          <span className="text-xs text-indigo-600 font-medium">IA</span></div></div>);};

export default AiNode;
