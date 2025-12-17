/**
 * Componente GeminiChatInterface - Interface de Chat com Gemini
 * @module modules/AI/Chat/components/GeminiChatInterface
 * @description
 * Interface de chat especializada para Google Gemini, fornecendo interface de mensagens
 * em tempo real, envio de mensagens, scroll autom?tico e suporte a processamento ass?ncrono.
 * @since 1.0.0
 */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';

/**
 * Interface GeminiChatInterfaceProps - Props do componente GeminiChatInterface
 * @interface GeminiChatInterfaceProps
 * @property {Array} messages - Lista de mensagens do chat
 * @property {string} input - Valor atual do input
 * @property {function} setInput - Fun??o para atualizar o input
 * @property {function} onSendMessage - Fun??o chamada ao enviar mensagem
 * @property {boolean} processing - Se est? processando mensagem
 */
interface GeminiChatInterfaceProps {
  messages: Array<{ role: 'user' | 'assistant';
  content: string;
  id?: string
children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }>;
  input: string;
  setInput?: (e: any) => void;
  onSendMessage?: (e: any) => void;
  processing: boolean;
}

/**
 * Componente GeminiChatInterface - Interface de Chat com Gemini
 * @component
 * @description
 * Componente que renderiza interface de chat especializada para Google Gemini,
 * incluindo ?rea de mensagens, input de texto e bot?o de envio.
 * 
 * @param {GeminiChatInterfaceProps} props - Props do componente
 * @returns {JSX.Element} Interface de chat com Gemini
 * 
 * @example
 * ```tsx
 * <GeminiChatInterface 
 *   messages={ messages }
 *   input={ input }
 *   setInput={ setInput }
 *   onSendMessage={ handleSend }
 *   processing={ loading }
 * / />
 * ```
 */
const GeminiChatInterface = React.memo(function GeminiChatInterface({ messages, input, setInput, onSendMessage, processing }: GeminiChatInterfaceProps) {
  const messagesEndRef = useRef<any>(null);

  useEffect(() => {
    (messagesEndRef.current)?.scrollIntoView({ behavior: 'smooth' });

  }, [messages]);

  return (
            <div className=" ">$2</div><div className="{messages.length === 0 ? (">$2</div>
          <div className="text-center text-gray-500 py-8">Comece a conversa...</div>
        ) : (
          (messages || []).map((m: unknown, idx: unknown) => (
            <div key={idx} className={`p-2 ${m.role === 'user' ? 'text-right' : 'text-left'} `}>{m.content}</div>
          ))
        )}
        <div ref={messagesEndRef} / />
           
        </div><form onSubmit={onSendMessage} className="p-4 border-t" />
        <div className=" ">$2</div><Textarea value={input} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)} placeholder="Digite sua mensagem..." className="flex-1 resize-none" rows={ 1 } />
          <Button type="submit" disabled={ processing || !input?.trim() }>Enviar</Button></div></form>
    </div>);

});

GeminiChatInterface.propTypes = {
  messages: PropTypes.array.isRequired,
  input: PropTypes.string.isRequired,
  setInput: PropTypes.func.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  processing: PropTypes.bool.isRequired,};

export default GeminiChatInterface;
