import React from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { ContactDetailsProps, AuraChatStatus } from '../types/auraTypes';
const ContactDetails: React.FC<ContactDetailsProps> = ({ 
  chat, 
  onUpdate, 
  onClose 
}) => {
  const getStatusColor = (status: AuraChatStatus): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      archived: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  const getStatusLabel = (status: AuraChatStatus): string => {
    const labels = {
      active: 'Ativo',
      closed: 'Fechado',
      archived: 'Arquivado',
      blocked: 'Bloqueado'
    };
    return labels[status] || 'Desconhecido';
  };
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Detalhes do Contato</Card.Title>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ✕
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        {/* Informações Básicas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Informações Básicas</h3>
            <Badge className={getStatusColor(chat.status)}>
              {getStatusLabel(chat.status)}
            </Badge>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-gray-900">{chat.contact_name || '-'}</p>
            </div>
            {chat.contact_phone && (
              <div>
                <label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className="text-gray-900">{chat.contact_phone}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-500">ID do Contato</label>
              <p className="text-gray-900 font-mono text-sm">{chat.contact_id}</p>
            </div>
          </div>
        </div>
        {/* Estatísticas da Conversa */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Estatísticas da Conversa</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {chat.unread_count}
              </div>
              <div className="text-sm text-gray-500">Mensagens não lidas</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {chat.status === 'active' ? '🟢' : '🔴'}
              </div>
              <div className="text-sm text-gray-500">Status</div>
            </div>
          </div>
        </div>
        {/* Informações de Tempo */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900">Informações de Tempo</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Criado em:</span>
              <span className="text-gray-900">{formatDate(chat.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Atualizado em:</span>
              <span className="text-gray-900">{formatDate(chat.updated_at)}</span>
            </div>
            {chat.last_message_at && (
              <div className="flex justify-between">
                <span className="text-gray-500">Última mensagem:</span>
                <span className="text-gray-900">{formatDate(chat.last_message_at)}</span>
              </div>
            )}
          </div>
        </div>
        {/* Última Mensagem */}
        {chat.last_message && (
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Última Mensagem</h3>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-700">{chat.last_message}</p>
            </div>
          </div>
        )}
        {/* Ações */}
        <div className="flex gap-2 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate?.(chat)}
          >
            Atualizar
          </Button>
          {chat.status === 'active' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdate?.({ ...chat, status: 'closed' })}
            >
              Fechar Chat
            </Button>
          )}
          {chat.status === 'closed' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onUpdate?.({ ...chat, status: 'active' })}
            >
              Reabrir Chat
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onUpdate?.({ ...chat, status: 'archived' })}
          >
            Arquivar
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};
export default ContactDetails;
