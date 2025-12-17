/**
 * @module AuraMessageBubble
 * @description Componente para exibir bolhas de mensagem em conversas do Aura.
 * 
 * Este componente renderiza uma bolha de mensagem com estilo diferenciado para
 * usu?rios e bots. Suporta exibi??o de avatares, timestamps, status de entrega
 * (enviado, entregue, lido) e tratamento de erros. O layout se adapta automaticamente
 * baseado no remetente da mensagem.
 * 
 * @example
 * ```tsx
 * <AuraMessageBubble
 *   message={
 *     sender: 'user',
 *     content: 'Ol?!',
 *     timestamp: '2024-01-29T10:00:00Z',
 *     status: 'read'
 *   } *   showAvatar={ true }
 *   showTimestamp={ true }
 * / />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { User, Bot, Clock, Check, CheckCheck, AlertCircle } from 'lucide-react';

/**
 * Interface para uma mensagem do Aura
 * 
 * @interface Message
 * @property {string} sender - Remetente da mensagem ('user', 'bot', 'system')
 * @property {string} [senderName] - Nome do remetente a ser exibido
 * @property {string} content - Conte?do/texto da mensagem
 * @property {string} [timestamp] - Data/hora da mensagem (ISO string)
 * @property {string} [created_at] - Data de cria??o (alternativa a timestamp)
 * @property {'sent' | 'delivered' | 'read' | 'error'} [status] - Status de entrega da mensagem
 * @property {string} [error] - Mensagem de erro (se status for 'error')
 */
interface Message {
  /** Remetente da mensagem */
  sender: 'user' | 'bot' | 'system';
  /** Nome do remetente a ser exibido */
  senderName?: string;
  /** Conte?do/texto da mensagem */
  content: string;
  /** Data/hora da mensagem em formato ISO string */
  timestamp?: string;
  /** Data de cria??o (alternativa a timestamp) */
  created_at?: string;
  /** Status de entrega da mensagem */
  status?: 'sent' | 'delivered' | 'read' | 'error';
  /** Mensagem de erro (apenas quando status for 'error') */
  error?: string; }

/**
 * Interface para as propriedades do componente AuraMessageBubble
 * 
 * @interface AuraMessageBubbleProps
 * @property {Message} message - Objeto da mensagem a ser exibida
 * @property {boolean} [showAvatar] - Se deve exibir o avatar do remetente (padr?o: true)
 * @property {boolean} [showTimestamp] - Se deve exibir o timestamp da mensagem (padr?o: true)
 * @property {string} [className] - Classes CSS adicionais
 */
interface AuraMessageBubbleProps {
  /** Objeto da mensagem a ser exibida */
message: Message;
  /** Se deve exibir o avatar do remetente (padr?o: true) */
showAvatar?: boolean;
  /** Se deve exibir o timestamp da mensagem (padr?o: true) */
showTimestamp?: boolean;
  /** Classes CSS adicionais */
className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

/**
 * Componente para exibir bolhas de mensagem em conversas
 * 
 * @param {AuraMessageBubbleProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AuraMessageBubble: React.FC<AuraMessageBubbleProps> = ({ message, 
  showAvatar = true,
  showTimestamp = true,
  className = ''
   }) => {
  const isUser = message?.sender === 'user';
  const isBot = message?.sender === 'bot' || message?.sender === 'system';
  const isError = message?.status === 'error';

  /**
   * Retorna o ?cone de status apropriado para uma mensagem
   * 
   * @param {'sent' | 'delivered' | 'read' | 'error'} status - Status da mensagem
   * @returns {JSX.Element | null} ?cone de status renderizado ou null
   */
  const getStatusIcon = (status?: string): JSX.Element | null => {
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
    } ;

  /**
   * Formata o timestamp para exibi??o de hora
   * 
   * @param {string | undefined} timestamp - Timestamp em formato ISO string
   * @returns {string} Hora formatada (ex: "10:30") ou string vazia se n?o fornecido
   */
  const formatTime = (timestamp?: string): string => {
    if (!timestamp) return '';
    const date = new Date(timestamp);

    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });};

  return (
        <>
      <div className={cn(
      'flex gap-3 mb-4',
      isUser ? 'justify-end' : 'justify-start',
      className
    )  }>
      </div>{/* Avatar */}
      { showAvatar && !isUser && (
        <div className=" ">$2</div><div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isBot ? 'bg-purple-100' : 'bg-gray-100'
          )  }>
        </div>{isBot ? (
              <Bot className="h-4 w-4 text-purple-600" />
            ) : (
              <User className="h-4 w-4 text-gray-600" />
            )}
          </div>
      )}
      {/* Message Content */}
      <div className={cn(
        'flex flex-col max-w-xs lg:max-w-md',
        isUser ? 'items-end' : 'items-start'
      )  }>
        </div>{/* Sender Name */}
        {!isUser && (
          <div className="{message?.senderName || (isBot ? 'Aura Bot' : 'Agente')}">$2</div>
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
        )  }>
        </div>{/* Message Content */}
          <div className="{message?.content}">$2</div>
          </div>
          {/* Message Status */}
          {isUser && message?.status && (
            <div className="{getStatusIcon(message.status)}">$2</div>
    </div>
  )}
        </div>
        {/* Timestamp */}
        { showTimestamp && (
          <div className={cn(
            'text-xs text-gray-400 mt-1 px-1',
            isUser ? 'text-right' : 'text-left'
          )  }>
        </div>{formatTime(message?.timestamp || message?.created_at)}
          </div>
        )}
        {/* Error Message */}
        {isError && message?.error && (
          <div className="{message.error}">$2</div>
    </div>
  )}
      </div>
      {/* User Avatar */}
      {showAvatar && isUser && (
        <div className=" ">$2</div><div className=" ">$2</div><User className="h-4 w-4 text-blue-600" />
          </div>
      )}
    </div>);};

export default AuraMessageBubble;
