import React from 'react';
import { Handle, Position } from 'reactflow';
import { 
  Mail, 
  Send, 
  User, 
  FileText, 
  Paperclip, 
  Image, 
  Link,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
const EmailNode = ({ data, isConnectable, selected }) => {
  const getEmailIcon = (type) => {
    switch (type) {
      case 'send':
        return <Send className="h-4 w-4" />;
      case 'template':
        return <FileText className="h-4 w-4" />;
      case 'attachment':
        return <Paperclip className="h-4 w-4" />;
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'link':
        return <Link className="h-4 w-4" />;
      case 'scheduled':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };
  const getEmailColor = (type) => {
    switch (type) {
      case 'send':
        return 'border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'template':
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
      case 'attachment':
        return 'border-green-300 bg-gradient-to-br from-green-50 to-green-100';
      case 'image':
        return 'border-pink-300 bg-gradient-to-br from-pink-50 to-pink-100';
      case 'link':
        return 'border-indigo-300 bg-gradient-to-br from-indigo-50 to-indigo-100';
      case 'scheduled':
        return 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-yellow-100';
      default:
        return 'border-purple-300 bg-gradient-to-br from-purple-50 to-purple-100';
    }
  };
  const emailType = data?.emailType || 'send';
  const emailName = data?.name || 'Email';
  const emailDescription = data?.description || 'Envia um email';
  return (
    <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getEmailColor(emailType),
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
        <div className="workflow-node-icon bg-purple-500">
          {getEmailIcon(emailType)}
        </div>
        <div className="workflow-node-title">
          {emailName}
        </div>
      </div>
      <div className="workflow-node-content">
        <p className="text-xs text-gray-600 mb-2">
          {emailDescription}
        </p>
        {data?.emailType && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="text-xs px-2 py-1 bg-white rounded-full border">
              {emailType}
            </span>
          </div>
        )}
        {data?.to && (
          <div className="flex items-center gap-2 mb-2">
            <User className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              Para: {data.to}
            </span>
          </div>
        )}
        {data?.subject && (
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-3 w-3 text-gray-500" />
            <span className="text-xs text-gray-600 truncate">
              {data.subject}
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
        {data?.attachments && data.attachments.length > 0 && (
          <div className="mt-2">
            <span className="text-xs font-medium text-gray-700">Anexos:</span>
            <div className="mt-1 space-y-1">
              {data.attachments.slice(0, 2).map((attachment, index) => (
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1 flex items-center gap-1">
                  <Paperclip className="h-3 w-3" />
                  {attachment.name}
                </div>
              ))}
              {data.attachments.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{data.attachments.length - 2} mais...
                </div>
              )}
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
        {data?.trackOpens !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.trackOpens ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.trackOpens ? 'Rastrear aberturas' : 'Não rastrear aberturas'}
            </span>
          </div>
        )}
        {data?.trackClicks !== undefined && (
          <div className="mt-2 flex items-center gap-2">
            <div className={cn(
              'w-2 h-2 rounded-full',
              data.trackClicks ? 'bg-green-500' : 'bg-gray-400'
            )}></div>
            <span className="text-xs text-gray-600">
              {data.trackClicks ? 'Rastrear cliques' : 'Não rastrear cliques'}
            </span>
          </div>
        )}
      </div>
      <div className="workflow-node-footer">
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-purple-600" />
          <span className="text-xs text-purple-600 font-medium">EMAIL</span>
        </div>
      </div>
    </div>
  );
};
export default EmailNode;
