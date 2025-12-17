/**
 * @module AuraChatList
 * @description Componente para exibir e gerenciar a lista de conversas do Aura.
 * 
 * Este componente exibe uma lista de conversas do Aura com informações sobre status,
 * última mensagem, data/hora e atribuição. Permite selecionar conversas e recarregar
 * a lista. Suporta dados iniciais ou carregamento automático via API.
 * 
 * @example
 * ```tsx
 * <AuraChatList
 *   chats={ chatsData }
 *   onSelect={ (chat: unknown) =>  }
 *   refreshTrigger={ refreshCount }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState, useEffect } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import auraService from '@/services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

/**
 * Interface para representar uma conversa do Aura
 * 
 * @interface Chat
 * @property {string} id - ID único da conversa
 * @property {string} [subject] - Assunto/título da conversa
 * @property {'open' | 'closed' | 'pending'} status - Status da conversa
 * @property {string} last_message_at - Data/hora da última mensagem (ISO string)
 * @property { text: string } [last_message_content] - Conteúdo da última mensagem
 * @property {string} [assigned_user_id] - ID do usuário atribuído à conversa
 * @property {string} [lead_id] - ID do lead associado à conversa
 */
interface Chat {
  /** ID único da conversa */
  id: string;
  /** Assunto/título da conversa */
  subject?: string;
  /** Status da conversa (aberta, fechada ou pendente) */
  status: 'open' | 'closed' | 'pending';
  /** Data/hora da última mensagem em formato ISO string */
  last_message_at: string;
  /** Conteúdo da última mensagem */
  last_message_content?: {
    /** Texto da última mensagem */
    text: string; };

  /** ID do usuário atribuído à conversa */
  assigned_user_id?: string;
  /** ID do lead associado à conversa */
  lead_id?: string;
}

/**
 * Interface para as propriedades do componente AuraChatList
 * 
 * @interface AuraChatListProps
 * @property {Chat[]} [chats] - Lista inicial de conversas (opcional, se não fornecido, carrega via API)
 * @property {(chat: Chat) => void} [onSelect] - Callback chamado quando uma conversa é selecionada
 * @property {number} [refreshTrigger] - Valor que, quando alterado, força o recarregamento da lista
 */
interface AuraChatListProps {
  /** Lista inicial de conversas (se fornecido, não carrega via API) */
chats?: Chat[];
  /** Callback chamado quando uma conversa é selecionada */
onSelect??: (e: any) => void;
  /** Valor que, quando alterado, força o recarregamento da lista de conversas */
refreshTrigger?: number;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
/**
 * Componente para exibir e gerenciar a lista de conversas do Aura
 * 
 * Componente memoizado para otimização de performance.
 * 
 * @param {AuraChatListProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const AuraChatList: React.FC<AuraChatListProps> = React.memo(function AuraChatList({ 
  chats: initialChats = [] as unknown[], 
  onSelect,
  refreshTrigger
}) {
  const [chats, setChats] = useState<Chat[]>(initialChats);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const { notify } = useAdvancedNotifications();

  /**
   * Carrega a lista de conversas da API
   * 
   * Se initialChats for fornecido e não estiver vazio, não carrega da API.
   * 
   * @async
   */
  const loadChats = async () => {
    if (initialChats.length > 0) return; // Use initial data if provided
    setIsLoading(true);

    setError(null);

    try {
      const response = await auraService.chats.getAll();

      setChats(response.data || []);

    } catch (err) {
      const errorMessage = 'Erro ao carregar conversas. Tente novamente.';
      setError(errorMessage);

      notify.error('Erro ao Carregar', errorMessage);

    } finally {
      setIsLoading(false);

    } ;

  useEffect(() => {
    loadChats();

  }, [refreshTrigger]);

  /**
   * Retorna o badge de status formatado para uma conversa
   * 
   * @param {string} status - Status da conversa
   * @returns {JSX.Element} Badge de status renderizado
   */
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Aberto', className: 'bg-green-100 text-green-800' },
      closed: { label: 'Fechado', className: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },};

    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-100 text-gray-800'};

    return (
        <>
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className} `}>
      </span>{config.label}
      </span>);};

  /**
   * Formata a data/hora da última mensagem para exibição
   * 
   * @param {string} timestamp - Data/hora em formato ISO string
   * @returns {string} Data/hora formatada ou o timestamp original se houver erro
   */
  const formatLastMessageTime = (timestamp: string): string => {
    try {
      return new Date(timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

    } catch {
      return timestamp;
    } ;

  /**
   * Manipula a seleção de uma conversa
   * 
   * @param {Chat} chat - Conversa selecionada
   */
  const handleChatSelect = (chat: Chat) => {
    if (onSelect) {
      onSelect(chat);

      notify.info('Chat Selecionado', `Carregando conversa de ${chat.subject || `Chat ${chat.id.slice(0, 8)}`}`);

    } ;

  if (isLoading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Conversas</Card.Title>
        </Card.Header>
        <Card.Content className="p-6" />
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-600">Carregando conversas...</span></div></Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Conversas</Card.Title>
        </Card.Header>
        <Card.Content className="p-6" />
          <div className=" ">$2</div><div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-700 mb-3">{error}</p>
            <Button
              onClick={ loadChats }
              variant="primary" />
              Tentar Novamente
            </Button></div></Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><Card.Title>Conversas ({chats.length})</Card.Title>
          <button
            onClick={ loadChats }
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
            title="Atualizar lista" />
            🔄
          </button></div></Card.Header>
      <Card.Content className="p-0" />
        {chats.length === 0 ? (
          <div className=" ">$2</div><div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma conversa encontrada</h3>
            <p className="text-gray-600 mb-4" />
              Quando alguém enviar uma mensagem, as conversas aparecerão aqui.
            </p>
            <Button
              onClick={ loadChats }
              variant="primary" />
              Verificar Novamente
            </Button>
      </div>
    </>
  ) : (
          <div className=" ">$2</div><ul className="divide-y divide-gray-200" />
              {(chats || []).map((chat: unknown) => (
                <li 
                  key={ chat.id }
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500" 
                  onClick={ () => handleChatSelect(chat)  }>
                  <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><span className="{chat.subject || `Chat ${chat.id.slice(0, 8)}...`}">$2</span>
                        </span>
                        {getStatusBadge(chat.status)}
                      </div>
                      {chat.last_message_content?.text && (
                        <p className="text-sm text-gray-600 truncate max-w-xs" />
                          {chat.last_message_content.text}
                        </p>
                      )}
                      <div className=" ">$2</div><span>{formatLastMessageTime(chat.last_message_at)}</span>
                        {chat.assigned_user_id && (
                          <span className="Atribuído">$2</span>
      </span>
    </>
  )}
                      </div>
                    <div className="→">$2</div>
                    </div>
      </li>
    </>
  ))}
            </ul>
      </div>
    </>
  )}
      </Card.Content>
    </Card>);

});

export default AuraChatList;
