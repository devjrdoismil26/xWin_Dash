import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  MessageSquare, 
  Send, 
  User, 
  FileText, 
  Image, 
  Video, 
  Mic,
  Paperclip,
  Link,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Smartphone
} from 'lucide-react';
import { cn } from '@/lib/utils';
const WhatsAppNode = ({ data, isConnectable, selected }) => {
  const getWhatsAppIcon = (type) => {
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
    }
  };
  const getWhatsAppColor = (type) => {
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
    }
  };
  const whatsappType = data?.whatsappType || 'text';
  const whatsappName = data?.name || 'WhatsApp';
  const whatsappDescription = data?.description || 'Envia uma mensagem via WhatsApp';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getWhatsAppColor(whatsappType),
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
        <div className="workflow-node-icon bg-emerald-500">
          {getWhatsAppIcon(whatsappType)}
        </div>
        <div className="workflow-node-title">
          {whatsappName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {whatsappDescription}
        </p>
        {data?.whatsappType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {whatsappType}
            </span>
          </div>
        )}
        {data?.to && (
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              Para: {data.to}
            </span>
          </div>
        )}
        {data?.message && (
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              {data.message}
            </span>
          </div>
        )}
        {data?.template && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Template:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {data.template}
            </span>
          </div>
        )}
        {data?.media && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Mídia:</span>
            <div className="mt-1 space-y-1">
              <div className="text-xs text-gray-600 bg-white rounded px-2 py-1 flex items-center gap-1">
                {data.media.type === 'image' && <Image className="h-3 w-3" />}
                {data.media.type === 'video' && <Video className="h-3 w-3" />}
                {data.media.type === 'audio' && <Mic className="h-3 w-3" />}
                {data.media.type === 'document' && <Paperclip className="h-3 w-3" />}
                {data.media.name}
              </div>
            </div>
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
        {data?.deliveryReport !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.deliveryReport ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.deliveryReport ? 'Relatório de entrega' : 'Sem relatório'}
            </span>
          </div>
        )}
        {data?.readReceipt !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.readReceipt ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.readReceipt ? 'Confirmação de leitura' : 'Sem confirmação'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <MessageSquare className="h-3 w-3 text-emerald-600" />
          <span className="text-xs text-emerald-600 font-medium">WHATSAPP</span>
        </div>
      </div>
    </div>
  );
};
export default WhatsAppNode;
