/**
 * @module ContactDetails
 * @description Componente para exibir detalhes completos de um contato/conversa do Aura.
 * 
 * Este componente exibe informações detalhadas sobre um contato, incluindo dados básicos,
 * estatísticas da conversa, informações de tempo e última mensagem. Permite atualizar
 * o status do chat e executar ações como fechar, reabrir ou arquivar.
 * 
 * @example
 * ```tsx
 * <ContactDetails
 *   chat={ chatData }
 *   onUpdate={ (updatedChat: unknown) =>  }
 *   onClose={ () =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React from 'react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import { ContactDetailsProps, AuraChatStatus } from '../types/auraTypes';

/**
 * Componente para exibir detalhes completos de um contato
 * 
 * @param {ContactDetailsProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const ContactDetails: React.FC<ContactDetailsProps> = ({ chat, 
  onUpdate, 
  onClose 
   }) => {
  const getStatusColor = (status: AuraChatStatus): string => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      archived: 'bg-yellow-100 text-yellow-800',
      blocked: 'bg-red-100 text-red-800'};

    return colors[status] || 'bg-gray-100 text-gray-800';};

  const getStatusLabel = (status: AuraChatStatus): string => {
    const labels = {
      active: 'Ativo',
      closed: 'Fechado',
      archived: 'Arquivado',
      blocked: 'Bloqueado'};

    return labels[status] || 'Desconhecido';};

  /**
   * Formata uma data para exibição em português brasileiro
   * 
   * @param {string} dateString - Data em formato ISO string
   * @returns {string} Data formatada (DD/MM/YYYY, HH:MM)
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });};

  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><Card.Title>Detalhes do Contato</Card.Title>
          { onClose && (
            <Button variant="ghost" size="sm" onClick={onClose } />
              ✕
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Content className="space-y-6" />
        {/* Informações Básicas */}
        <div className=" ">$2</div><div className=" ">$2</div><h3 className="font-medium text-gray-900">Informações Básicas</h3>
            <Badge className={getStatusColor(chat.status) } />
              {getStatusLabel(chat.status)}
            </Badge></div><div className=" ">$2</div><div>
           
        </div><label className="text-sm font-medium text-gray-500">Nome</label>
              <p className="text-gray-900">{chat.contact_name || '-'}</p>
            </div>
            {chat.contact_phone && (
              <div>
           
        </div><label className="text-sm font-medium text-gray-500">Telefone</label>
                <p className="text-gray-900">{chat.contact_phone}</p>
      </div>
    </>
  )}
            <div>
           
        </div><label className="text-sm font-medium text-gray-500">ID do Contato</label>
              <p className="text-gray-900 font-mono text-sm">{chat.contact_id}</p></div></div>
        {/* Estatísticas da Conversa */}
        <div className=" ">$2</div><h3 className="font-medium text-gray-900">Estatísticas da Conversa</h3>
          <div className=" ">$2</div><div className=" ">$2</div><div className="{chat.unread_count}">$2</div>
              </div>
              <div className="text-sm text-gray-500">Mensagens não lidas</div>
            <div className=" ">$2</div><div className="{chat.status === 'active' ? '🟢' : '🔴'}">$2</div>
              </div>
              <div className="text-sm text-gray-500">Status</div>
          </div>
        {/* Informações de Tempo */}
        <div className=" ">$2</div><h3 className="font-medium text-gray-900">Informações de Tempo</h3>
          <div className=" ">$2</div><div className=" ">$2</div><span className="text-gray-500">Criado em:</span>
              <span className="text-gray-900">{formatDate(chat.created_at)}</span></div><div className=" ">$2</div><span className="text-gray-500">Atualizado em:</span>
              <span className="text-gray-900">{formatDate(chat.updated_at)}</span>
            </div>
            {chat.last_message_at && (
              <div className=" ">$2</div><span className="text-gray-500">Última mensagem:</span>
                <span className="text-gray-900">{formatDate(chat.last_message_at)}</span>
      </div>
    </>
  )}
          </div>
        {/* Última Mensagem */}
        {chat.last_message && (
          <div className=" ">$2</div><h3 className="font-medium text-gray-900">Última Mensagem</h3>
            <div className=" ">$2</div><p className="text-sm text-gray-700">{chat.last_message}</p>
      </div>
    </>
  )}
        {/* Ações */}
        <div className=" ">$2</div><Button 
            variant="outline" 
            size="sm"
            onClick={ () => onUpdate?.(chat)  }>
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
          </Button></div></Card.Content>
    </Card>);};

export default ContactDetails;
