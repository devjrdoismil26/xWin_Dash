/**
 * Componente EnhancedAIChatInterface - Interface de Chat com IA Avançada
 * @module modules/AI/Chat/components/EnhancedAIChatInterface
 * @description
 * Interface de chat avançada com IA, fornecendo suporte a múltiplos tipos de mensagens
 * (texto, código, imagem, arquivo, sistema), status de processamento, indicadores de ação
 * atual, seleção de modelo e interface completa de chat com scroll automático.
 * @since 1.0.0
 */
import React from 'react';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface ChatMessage - Mensagem do chat
 * @interface ChatMessage
 * @property {string} id - ID único da mensagem
 * @property {'user' | 'ai'} sender - Remetente da mensagem (usuário ou IA)
 * @property {'text' | 'code' | 'image' | 'file' | 'system'} type - Tipo da mensagem
 * @property {string} content - Conteúdo da mensagem
 */
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  type: 'text' | 'code' | 'image' | 'file' | 'system';
  content: string; }

/**
 * Interface EnhancedAIChatInterfaceProps - Props do componente EnhancedAIChatInterface
 * @interface EnhancedAIChatInterfaceProps
 * @property {ChatMessage[]} messages - Lista de mensagens do chat
 * @property {string} input - Valor atual do input
 * @property {function} setInput - Função para atualizar o input
 * @property {(v: string) => void} setInput - Callback para atualizar valor do input
 * @property {function} onSend - Função chamada ao enviar mensagem
 * @property {(e: React.FormEvent) => void} onSend - Callback de envio de mensagem
 * @property {boolean} [processing] - Se está processando mensagem (opcional)
 * @property {string} [aiStatus] - Status atual da IA (opcional)
 * @property {string} [currentAction] - Ação atual sendo executada (opcional)
 * @property {string} [model] - Modelo de IA sendo usado (opcional)
 * @property {string} [className] - Classes CSS adicionais (opcional)
 */
interface EnhancedAIChatInterfaceProps {
  messages: ChatMessage[];
  input: string;
  setInput?: (e: any) => void;
  onSend?: (e: any) => void;
  processing?: boolean;
  aiStatus?: string;
  currentAction?: string;
  model?: string;
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const EnhancedAIChatInterface: React.FC<EnhancedAIChatInterfaceProps> = ({ messages, input, setInput, onSend, processing, aiStatus, currentAction, model, className    }) => {
  return (
        <>
      <div className={`flex flex-col h-full bg-white ${className || ''} `}>
      </div><div className=" ">$2</div><div className="text-sm text-gray-600">{currentAction || 'chat'} • {aiStatus || 'idle'}</div>
        {model && <Badge variant="secondary" className="text-xs">{model}</Badge>}
      </div>
      <div className="{messages.length === 0 ? (">$2</div>
          <div className="text-gray-500 text-sm">Sem mensagens</div>
        ) : (
          (messages || []).map((m: unknown) => (
            <div key={m.id} className={`p-2 rounded ${m.sender === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-100 text-gray-900'} `}>{m.content}</div>
          ))
        )}
      </div>
      <form onSubmit={onSend} className="p-3 border-t" />
        <div className=" ">$2</div><Textarea value={input} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 resize-none" rows={ 1 } />
          <Button type="submit" disabled={ processing || !input?.trim() }>Enviar</Button></div></form>
    </div>);};

export default EnhancedAIChatInterface;
