import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Input from '@/components/ui/Input';
import InputLabel from '@/components/ui/InputLabel';
import { MessageSenderProps, AuraMessage, AuraMessageType, AuraTemplate } from '../types/auraTypes';
import { toast } from 'sonner';
const MessageSender: React.FC<MessageSenderProps> = ({ 
  chatId, 
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
        timestamp: new Date().toISOString()
      };
      await onMessageSend?.(newMessage);
      setMessage('');
      setSelectedTemplate(null);
      toast.success('Mensagem enviada com sucesso!');
    } catch (error) {
      toast.error('Erro ao enviar mensagem');
    } finally {
      setIsSending(false);
    }
  };
  const handleTemplateSelect = (template: AuraTemplate) => {
    setSelectedTemplate(template);
    setMessage(template.content);
    setMessageType('template');
    onTemplateSelect?.(template);
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSendMessage();
    }
  };
  const getMessageTypeIcon = (type: AuraMessageType): string => {
    const icons = {
      text: '📝',
      image: '🖼️',
      video: '🎥',
      audio: '🎵',
      document: '📄',
      location: '📍',
      contact: '👤',
      template: '📋'
    };
    return icons[type] || '📝';
  };
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center justify-between">
          <Card.Title>Enviar Mensagem</Card.Title>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Chat ID: {chatId}</span>
          </div>
        </div>
      </Card.Header>
      <Card.Content className="space-y-4">
        {/* Tipo de Mensagem */}
        <div>
          <InputLabel htmlFor="messageType">Tipo de Mensagem</InputLabel>
          <Select
            id="messageType"
            value={messageType}
            onChange={(value) => setMessageType(value as AuraMessageType)}
            options={messageTypeOptions}
          />
        </div>
        {/* Templates */}
        {messageType === 'template' && (
          <div>
            <InputLabel>Templates Disponíveis</InputLabel>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className={`p-3 text-left border rounded-lg transition-colors ${
                    selectedTemplate?.id === template.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{template.name}</div>
                      <div className="text-sm text-gray-500">{template.type}</div>
                    </div>
                    <div className="text-lg">📋</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Campo de Mensagem */}
        <div>
          <InputLabel htmlFor="message">
            Mensagem {getMessageTypeIcon(messageType)}
          </InputLabel>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={
              messageType === 'template' 
                ? 'Selecione um template ou digite sua mensagem...'
                : `Digite sua mensagem de ${messageType}...`
            }
            rows={4}
            className="resize-none"
          />
          <div className="text-xs text-gray-500 mt-1">
            Pressione Ctrl+Enter para enviar
          </div>
        </div>
        {/* Contador de Caracteres */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{message.length} caracteres</span>
          <span>
            {messageType === 'text' && message.length > 160 && (
              <span className="text-yellow-600">
                {Math.ceil(message.length / 160)} mensagem(s)
              </span>
            )}
          </span>
        </div>
      </Card.Content>
      <Card.Footer>
        <div className="flex items-center justify-between w-full">
          <div className="text-sm text-gray-500">
            {selectedTemplate && (
              <span>Template: {selectedTemplate.name}</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setMessage('');
                setSelectedTemplate(null);
              }}
              disabled={isSending}
            >
              Limpar
            </Button>
            <Button 
              onClick={handleSendMessage} 
              disabled={!message.trim() || isSending}
              loading={isSending}
              loadingText="Enviando..."
            >
              Enviar
            </Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
};
export default MessageSender;
