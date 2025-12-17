import React from 'react';
import { Handle, Position } from 'reactflow';
import { Target, Megaphone, TrendingUp, DollarSign, Users, Eye, MousePointer, BarChart, Calendar, Globe, Smartphone, Monitor, Search, MessageSquare, Image, Video, FileText, Zap, Play, Pause, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
const AdCreationNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getAdIcon = (type: unknown) => {
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
    } ;

  const getAdColor = (type: unknown) => {
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
    } ;

  const adType = data?.adType || 'display';
  const adName = data?.name || 'Anúncio';
  const adDescription = data?.description || 'Cria e gerencia anúncios';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getAdColor(adType),
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
      <div className=" ">$2</div><div className="{getAdIcon(adType)}">$2</div>
        </div>
        <div className="{adName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {adDescription}
        </p>
        {data?.adType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Plataforma:</span>
            <span className="{adType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.campaignName && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Campanha:</span>
            <span className="{data.campaignName}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.budget && (
          <div className=" ">$2</div><DollarSign className="h-3 w-3 text-gray-500" />
            <span className="Orçamento: R$ {data.budget}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.targetAudience && (
          <div className=" ">$2</div><Users className="h-3 w-3 text-gray-500" />
            <span className="Público: {data.targetAudience}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.adFormat && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Formato:</span>
            <span className="{data.adFormat}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.creative && (
          <div className=" ">$2</div><Image className="h-3 w-3 text-gray-500" />
            <span className="Criativo: {data.creative}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.schedule && (
          <div className=" ">$2</div><Calendar className="h-3 w-3 text-gray-500" />
            <span className="{data.schedule}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.bidding && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Lance:</span>
            <span className="{data.bidding}">$2</span>
            </span>
      </div>
    </>
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
        {data?.metrics && Object.keys(data.metrics).length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Métricas:</span>
            <div className="{Object.entries(data.metrics).slice(0, 2).map(([key, value]) => (">$2</div>
                <div key={key} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
           
        </div><span className="font-medium">{key}:</span> {value}
                </div>
              ))}
              {Object.keys(data.metrics).length > 2 && (
                <div className="+{Object.keys(data.metrics).length - 2} mais...">$2</div>
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
              (data as any).status === 'rejected' && 'bg-red-100 text-red-800'
            )  }>
        </span>{data.status}
            </span>
      </div>
    </>
  )}
        { data?.autoOptimize !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).autoOptimize ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.autoOptimize ? 'Otimização Automática' : 'Otimização Manual'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Target className="h-3 w-3 text-orange-600" />
          <span className="text-xs text-orange-600 font-medium">ANÚNCIO</span></div></div>);};

export default AdCreationNode;
