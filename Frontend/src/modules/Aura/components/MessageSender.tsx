/**
 * @module MessageSender
 * @description Componente para enviar mensagens em chats do Aura.
 * 
 * Este componente permite enviar mensagens de diferentes tipos (texto, imagem,
 * vídeo, áudio, documento, localização, contato, template) para um chat específico.
 * Suporta seleção de templates pré-definidos e contador de caracteres para mensagens
 * de texto. Inclui atalho de teclado (Ctrl+Enter) para envio rápido.
 * 
 * @example
 * ```tsx
 * <MessageSender
 *   chatId={ 123 }
 *   onMessageSend={ (message: unknown) =>  }
 *   onTemplateSelect={ (template: unknown) =>  }
 * />
 * ```
 * 
 * @since 1.0.0
 */

import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Textarea from '@/shared/components/ui/Textarea';
import Select from '@/shared/components/ui/Select';
import Input from '@/shared/components/ui/Input';
import InputLabel from '@/shared/components/ui/InputLabel';
import { MessageSenderProps, AuraMessage, AuraMessageType, AuraTemplate } from '../types/auraTypes';
import { toast } from 'sonner';

/**
 * Componente para enviar mensagens em chats
 * 
 * @param {MessageSenderProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente renderizado
 */
const MessageSender: React.FC<MessageSenderProps> = ({ chatId, 
  onMessageSend, 
  onTemplateSelect 
   }) => {
  const [message, setMessage] = useState('');

  const [messageType, setMessageType] = useState<AuraMessageType>('text');

  const [isSending, setIsSending] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<AuraTemplate | null>(null);

  // Templates mockados - em produção viria de uma API
  const templates: AuraTemplate[] = [
    {
      id: 1,
      name: 'Boas-vindas',
      type: 'welcome',
      content: 'Olá! Bem-vindo(a) ao nosso atendimento. Como posso ajudá-lo(a) hoje?',
      variables: [],
      platform: 'whatsapp',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  },
    {
      id: 2,
      name: 'Agradecimento',
      type: 'support',
      content: 'Obrigado pelo seu contato! Sua mensagem foi recebida e será respondida em breve.',
      variables: [],
      platform: 'whatsapp',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  },
    {
      id: 3,
      name: 'Lembrete',
      type: 'reminder',
      content: 'Lembrete: Você tem um agendamento para amanhã às 14h. Confirma sua presença?',
      variables: ['data', 'hora'],
      platform: 'whatsapp',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
  }
  ];
  const messageTypeOptions = [
    { value: 'text', label: 'Texto' },
    { value: 'image', label: 'Imagem' },
    { value: 'video', label: 'Vídeo' },
    { value: 'audio', label: 'Áudio' },
    { value: 'document', label: 'Documento' },
    { value: 'location', label: 'Localização' },
    { value: 'contact', label: 'Contato' },
    { value: 'template', label: 'Template' }
  ];
  /**
   * Envia uma mensagem para o chat
   * 
   * @async
   */
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error('Digite uma mensagem');

      return;
    }
    setIsSending(true);

    try {
      const newMessage: Partial<AuraMessage> = {
        chat_id: chatId,
        type: messageType,
        content: message,
        direction: 'outbound',
        status: 'sent',
        timestamp: new Date().toISOString()};

      await onMessageSend?.(newMessage);

      setMessage('');

      setSelectedTemplate(null);

      toast.success('Mensagem enviada com sucesso!');

    } catch (error) {
      toast.error('Erro ao enviar mensagem');

    } finally {
      setIsSending(false);

    } ;

  /**
   * Seleciona um template e preenche o campo de mensagem
   * 
   * @param {AuraTemplate} template - Template selecionado
   */
  const handleTemplateSelect = (template: AuraTemplate) => {
    setSelectedTemplate(template);

    setMessage(template.content);

    setMessageType('template');

    onTemplateSelect?.(template);};

  /**
   * Manipula o atalho de teclado Ctrl+Enter para enviar mensagem
   * 
   * @param {React.KeyboardEvent} e - Evento de teclado
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSendMessage();

    } ;

  /**
   * Retorna o ícone emoji para o tipo de mensagem
   * 
   * @param {AuraMessageType} type - Tipo de mensagem
   * @returns {string} Emoji do ícone
   */
  const getMessageTypeIcon = (type: AuraMessageType): string => {
    const icons = {
      text: '📝',
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      document: '📄',
      location: '📍',
      contact: '👤',
      template: '📋'};

    return icons[type] || '📝';};

  return (
        <>
      <Card />
      <Card.Header />
        <div className=" ">$2</div><Card.Title>Enviar Mensagem</Card.Title>
          <div className=" ">$2</div><span className="text-sm text-gray-500">Chat ID: {chatId}</span></div></Card.Header>
      <Card.Content className="space-y-6" />
        {/* Tipo de Mensagem */}
        <div>
           
        </div><InputLabel htmlFor="messageType">Tipo de Mensagem</InputLabel>
          <Select
            id="messageType"
            value={ messageType }
            onChange={ (value: unknown) => setMessageType(value as AuraMessageType) }
            options={ messageTypeOptions } />
        </div>
        {/* Templates */}
        {messageType === 'template' && (
          <div>
           
        </div><InputLabel>Templates Disponíveis</InputLabel>
            <div className="{(templates || []).map((template: unknown) => (">$2</div>
                <button
                  key={ template.id }
                  onClick={ () => handleTemplateSelect(template) }
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  } `}
  >
                  <div className=" ">$2</div><div>
           
        </div><div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.type}</div>
                    <div className="text-lg">📋</div>
      </button>
    </>
  ))}
            </div>
        )}
        {/* Campo de Mensagem */}
        <div>
           
        </div><InputLabel htmlFor="message" />
            Mensagem {getMessageTypeIcon(messageType)}
          </InputLabel>
          <Textarea
            id="message"
            value={ message }
            onChange={ (e: unknown) => setMessage(e.target.value) }
            onKeyDown={ handleKeyPress }
            placeholder={
              messageType === 'template' 
                ? 'Selecione um template ou digite sua mensagem...'
                : `Digite sua mensagem de ${messageType}...`
            }
            rows={ 4 }
            className="resize-none" />
          <div className="Pressione Ctrl+Enter para enviar">$2</div>
          </div>
        {/* Contador de Caracteres */}
        <div className=" ">$2</div><span>{message.length} caracteres</span>
          <span>
           
        </span>{messageType === 'text' && message.length > 160 && (
              <span className="{Math.ceil(message.length / 160)} mensagem(s)">$2</span>
      </span>
    </>
  )}
          </span></div></Card.Content>
      <Card.Footer />
        <div className=" ">$2</div><div className="{selectedTemplate && (">$2</div>
              <span>Template: {selectedTemplate.name}</span>
            )}
          </div>
          <div className=" ">$2</div><Button 
              variant="outline" 
              onClick={() => {
                setMessage('');

                setSelectedTemplate(null);

              } disabled={ isSending  }>
              Limpar
            </Button>
            <Button 
              onClick={ handleSendMessage }
              disabled={ !message.trim() || isSending }
              loading={ isSending }
              loadingText="Enviando..." />
              Enviar
            </Button></div></Card.Footer>
    </Card>);};

export default MessageSender;
