import React from 'react';
import { Handle, Position } from 'reactflow';
import { Mail, ShoppingCart, Gift, Package, Send, Users, Target, Calendar, Clock, TrendingUp, TrendingDown, Eye, MousePointer, CheckCircle, XCircle, AlertTriangle, FileText, Image, Link, BarChart, PieChart, Zap, Settings, Play, Pause, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
const EmailCampaignNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getCampaignIcon = (type: unknown) => {
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
    } ;

  const getCampaignColor = (type: unknown) => {
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
    } ;

  const campaignType = data?.campaignType || 'newsletter';
  const campaignName = data?.name || 'Campanha de Email';
  const campaignDescription = data?.description || 'Gerencia campanha de email';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getCampaignColor(campaignType),
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
      <div className=" ">$2</div><div className="{getCampaignIcon(campaignType)}">$2</div>
        </div>
        <div className="{campaignName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {campaignDescription}
        </p>
        {data?.campaignType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{campaignType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.subject && (
          <div className=" ">$2</div><FileText className="h-3 w-3 text-gray-500" />
            <span className="{data.subject}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.audience && (
          <div className=" ">$2</div><Users className="h-3 w-3 text-gray-500" />
            <span className="Público: {data.audience}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.template && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Template:</span>
            <span className="{data.template}">$2</span>
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
        {data?.segments && (data as any).segments.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Segmentos:</span>
            <div className="{data.segments.slice(0, 2).map((segment: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
            {segment}
          </div>
              ))}
              {data.segments.length > 2 && (
                <div className="+{data.segments.length - 2} mais...">$2</div>
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
        {data?.personalization && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Personalização:</span>
            <span className="{data.personalization}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.a_b_test && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">A/B Test:</span>
            <span className="{data.a_b_test}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.status && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Status:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).status === 'active' && 'bg-green-100 text-green-800',
              (data as any).status === 'paused' && 'bg-yellow-100 text-yellow-800',
              (data as any).status === 'draft' && 'bg-gray-100 text-gray-800',
              (data as any).status === 'completed' && 'bg-blue-100 text-blue-800',
              (data as any).status === 'cancelled' && 'bg-red-100 text-red-800'
            )  }>
        </span>{data.status}
            </span>
      </div>
    </>
  )}
        { data?.priority && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Prioridade:</span>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full',
              (data as any).priority === 'high' && 'bg-red-100 text-red-800',
              (data as any).priority === 'medium' && 'bg-yellow-100 text-yellow-800',
              (data as any).priority === 'low' && 'bg-green-100 text-green-800'
            )  }>
        </span>{data.priority}
            </span>
      </div>
    </>
  )}
        { data?.tracking !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).tracking ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.tracking ? 'Rastreamento Ativo' : 'Rastreamento Inativo'}">$2</span>
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
      <div className=" ">$2</div><div className=" ">$2</div><Mail className="h-3 w-3 text-purple-600" />
          <span className="text-xs text-purple-600 font-medium">CAMPANHA</span></div></div>);};

export default EmailCampaignNode;
