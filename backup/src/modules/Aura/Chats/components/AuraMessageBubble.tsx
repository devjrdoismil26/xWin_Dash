import React from 'react';
import { cn } from '@/lib/utils';
import { 
  User, 
  Bot, 
  Clock, 
  Check, 
  CheckCheck,
  AlertCircle
} from 'lucide-react';
const AuraMessageBubble = ({ 
  message, 
  showAvatar = true,
  showTimestamp = true,
  className = ''
}) => {
  const isUser = message?.sender === 'user';
  const isBot = message?.sender === 'bot' || message?.sender === 'system';
  const isError = message?.status === 'error';
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };
  return (
    <div className={cn(
      'flex gap-3 mb-4',
      isUser ? 'justify-end' : 'justify-start',
      className
    )}>
      {/* Avatar */}
      {showAvatar && !isUser && (
        <div className="flex-shrink-0">
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isBot ? 'bg-purple-100' : 'bg-gray-100'
          )}>
            {isBot ? (
              <Bot className="h-4 w-4 text-purple-600" />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>
        </div>
      )}
      {/* Message Content */}
      <div className={cn(
        'flex flex-col max-w-xs lg:max-w-md',
        isUser ? 'items-end' : 'items-start'
      )}>
        {/* Sender Name */}
        {!isUser && (
          <div className="text-xs text-gray-500 mb-1 px-1">
            {message?.senderName || (isBot ? 'Aura Bot' : 'Agente')}
          </div>
        )}
        {/* Message Bubble */}
        <div className={cn(
          'relative px-4 py-3 rounded-2xl shadow-sm',
          'transition-all duration-200 hover:shadow-md',
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : isError
            ? 'bg-red-50 text-red-900 border border-red-200 rounded-bl-md'
            : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
        )}>
          {/* Message Content */}
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {message?.content}
          </div>
          {/* Message Status */}
          {isUser && message?.status && (
            <div className="flex items-center justify-end mt-1 gap-1">
              {getStatusIcon(message.status)}
            </div>
          )}
        </div>
        {/* Timestamp */}
        {showTimestamp && (
          <div className={cn(
            'text-xs text-gray-400 mt-1 px-1',
            isUser ? 'text-right' : 'text-left'
          )}>
            {formatTime(message?.timestamp || message?.created_at)}
          </div>
        )}
        {/* Error Message */}
        {isError && message?.error && (
          <div className="text-xs text-red-500 mt-1 px-1">
            {message.error}
          </div>
        )}
      </div>
      {/* User Avatar */}
      {showAvatar && isUser && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-4 w-4 text-blue-600" />
          </div>
        </div>
      )}
    </div>
  );
};
export default AuraMessageBubble;
