import React from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare, Send, User, FileText, Image, Video, Mic, Paperclip, Link, Calendar, Clock, CheckCircle, AlertCircle, Phone, Smartphone } from 'lucide-react';
import { cn } from '@/lib/utils';
const WhatsAppNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getWhatsAppIcon = (type: unknown) => {
    switch (type) {
      case 'text':
        return <MessageSquare className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Mic className="h-4 w-4" />;
      case 'document':
        return <Paperclip className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      case 'call':
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    } ;

  const getWhatsAppColor = (type: unknown) => {
    switch (type) {
      case 'text':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'image':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'video':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'audio':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'document':
        return 'border-orange-300 bg-gradient-to-br from-orange-50 to-orange-100';
      case 'link':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'template':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'call':
        return 'border-red-300 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100';
    } ;

  const whatsappType = data?.whatsappType || 'text';
  const whatsappName = data?.name || 'WhatsApp';
  const whatsappDescription = data?.description || 'Envia uma mensagem via WhatsApp';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getWhatsAppColor(whatsappType),
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
      <div className=" ">$2</div><div className="{getWhatsAppIcon(whatsappType)}">$2</div>
        </div>
        <div className="{whatsappName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {whatsappDescription}
        </p>
        {data?.whatsappType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{whatsappType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.to && (
          <div className=" ">$2</div><Smartphone className="h-3 w-3 text-gray-500" />
            <span className="Para: {data.to}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.message && (
          <div className=" ">$2</div><MessageSquare className="h-3 w-3 text-gray-500" />
            <span className="{data.message}">$2</span>
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
        {data?.media && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Mídia:</span>
            <div className=" ">$2</div><div className="{data.media.type === 'image' && ">$2</div><Image className="h-3 w-3" />}
                {data.media.type === 'video' && <Video className="h-3 w-3" />}
                {data.media.type === 'audio' && <Mic className="h-3 w-3" />}
                {data.media.type === 'document' && <Paperclip className="h-3 w-3" />}
                {data.media.name}
              </div>
    </div>
  )}
        {data?.schedule && (
          <div className=" ">$2</div><Calendar className="h-3 w-3 text-gray-500" />
            <span className="{data.schedule}">$2</span>
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
        { data?.deliveryReport !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).deliveryReport ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.deliveryReport ? 'Relatório de entrega' : 'Sem relatório'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.readReceipt !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).readReceipt ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.readReceipt ? 'Confirmação de leitura' : 'Sem confirmação'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><MessageSquare className="h-3 w-3 text-emerald-600" />
          <span className="text-xs text-emerald-600 font-medium">WHATSAPP</span></div></div>);};

export default WhatsAppNode;
