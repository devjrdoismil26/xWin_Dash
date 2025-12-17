import React from 'react';
import { Handle, Position } from 'reactflow';
import { Mail, Send, User, FileText, Paperclip, Image, Link, Calendar, Clock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
const EmailNode: React.FC<{ id: string; data: Record<string, any>; selected?: boolean; onUpdate??: (e: any) => void; onDelete??: (e: any) => void; onConnect???: (e: any) => void; onDisconnect???: (e: any) => void }> = ({ data, isConnectable, selected }) => {
  const getEmailIcon = (type: unknown) => {
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
    } ;

  const getEmailColor = (type: unknown) => {
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
    } ;

  const emailType = data?.emailType || 'send';
  const emailName = data?.name || 'Email';
  const emailDescription = data?.description || 'Envia um email';
  return (
        <>
      <div className={cn(
      'workflow-node min-w-[200px] max-w-[250px]',
      getEmailColor(emailType),
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
      <div className=" ">$2</div><div className="{getEmailIcon(emailType)}">$2</div>
        </div>
        <div className="{emailName}">$2</div>
        </div>
      <div className=" ">$2</div><p className="text-xs text-gray-600 mb-2" />
          {emailDescription}
        </p>
        {data?.emailType && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Tipo:</span>
            <span className="{emailType}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.to && (
          <div className=" ">$2</div><User className="h-3 w-3 text-gray-500" />
            <span className="Para: {data.to}">$2</span>
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
        {data?.template && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Template:</span>
            <span className="{data.template}">$2</span>
            </span>
      </div>
    </>
  )}
        {data?.attachments && (data as any).attachments.length > 0 && (
          <div className=" ">$2</div><span className="text-xs font-medium text-gray-700">Anexos:</span>
            <div className="{data.attachments.slice(0, 2).map((attachment: unknown, index: unknown) => (">$2</div>
                <div key={index} className="text-xs text-gray-600 bg-white rounded px-2 py-1 flex items-center gap-1">
           
        </div><Paperclip className="h-3 w-3" />
                  {attachment.name}
                </div>
              ))}
              {data.attachments.length > 2 && (
                <div className="+{data.attachments.length - 2} mais...">$2</div>
    </div>
  )}
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
        { data?.trackOpens !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).trackOpens ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.trackOpens ? 'Rastrear aberturas' : 'Não rastrear aberturas'}">$2</span>
            </span>
      </div>
    </>
  )}
        { data?.trackClicks !== undefined && (
          <div className=" ">$2</div><div className={cn(
              'w-2 h-2 rounded-full',
              (data as any).trackClicks ? 'bg-green-500' : 'bg-gray-400'
            )  }>
        </div><span className="{data.trackClicks ? 'Rastrear cliques' : 'Não rastrear cliques'}">$2</span>
            </span>
      </div>
    </>
  )}
      </div>
      <div className=" ">$2</div><div className=" ">$2</div><Mail className="h-3 w-3 text-purple-600" />
          <span className="text-xs text-purple-600 font-medium">EMAIL</span></div></div>);};

export default EmailNode;
