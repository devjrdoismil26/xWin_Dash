import React, { useState, useEffect } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import auraService from '../../services/auraService';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';
interface Chat {
  id: string;
  subject?: string;
  status: 'open' | 'closed' | 'pending';
  last_message_at: string;
  last_message_content?: {
    text: string;
  };
  assigned_user_id?: string;
  lead_id?: string;
}
interface AuraChatListProps {
  chats?: Chat[];
  onSelect?: (chat: Chat) => void;
  refreshTrigger?: number;
}
const AuraChatList: React.FC<AuraChatListProps> = React.memo(function AuraChatList({ 
  chats: initialChats = [], 
  onSelect,
  refreshTrigger
}) {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    }
  };
  useEffect(() => {
    loadChats();
  }, [refreshTrigger]);
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: 'Aberto', className: 'bg-green-100 text-green-800' },
      closed: { label: 'Fechado', className: 'bg-gray-100 text-gray-800' },
      pending: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
    };
    const config = statusConfig[status as keyof typeof statusConfig] || 
                   { label: status, className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };
  const formatLastMessageTime = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timestamp;
    }
  };
  const handleChatSelect = (chat: Chat) => {
    if (onSelect) {
      onSelect(chat);
      notify.info('Chat Selecionado', `Carregando conversa de ${chat.subject || `Chat ${chat.id.slice(0, 8)}`}`);
    }
  };
  if (isLoading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Conversas</Card.Title>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
            <span className="text-gray-600">Carregando conversas...</span>
          </div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Conversas</Card.Title>
        </Card.Header>
        <Card.Content className="p-6">
          <div className="text-center">
            <div className="text-red-600 mb-2">⚠️</div>
            <p className="text-red-700 mb-3">{error}</p>
            <Button
              onClick={loadChats}
              variant="primary"
            >
              Tentar Novamente
            </Button>
          </div>
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Conversas ({chats.length})</Card.Title>
          <button
            onClick={loadChats}
            className="text-blue-600 hover:text-blue-800 text-sm transition-colors"
            title="Atualizar lista"
          >
            🔄
          </button>
        </div>
      </Card.Header>
      <Card.Content className="p-0">
        {chats.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">Nenhuma conversa encontrada</h3>
            <p className="text-gray-600 mb-4">
              Quando alguém enviar uma mensagem, as conversas aparecerão aqui.
            </p>
            <Button
              onClick={loadChats}
              variant="primary"
            >
              Verificar Novamente
            </Button>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {chats.map((chat) => (
                <li 
                  key={chat.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500" 
                  onClick={() => handleChatSelect(chat)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">
                          {chat.subject || `Chat ${chat.id.slice(0, 8)}...`}
                        </span>
                        {getStatusBadge(chat.status)}
                      </div>
                      {chat.last_message_content?.text && (
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {chat.last_message_content.text}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                        <span>{formatLastMessageTime(chat.last_message_at)}</span>
                        {chat.assigned_user_id && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            Atribuído
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 text-gray-400">
                      →
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card.Content>
    </Card>
  );
});
export default AuraChatList;
