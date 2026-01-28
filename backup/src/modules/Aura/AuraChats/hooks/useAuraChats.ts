/**
 * Hook especializado para chats do Aura
 * Gerencia conversas, mensagens e contatos
 */
import { useCallback, useState, useEffect } from 'react';
import { AuraChat, AuraMessage, AuraContact, MessageType, ChatStatus } from '../types';
import { useAdvancedNotifications } from '@/hooks/useAdvancedNotifications';

export const useAuraChats = () => {
  const [chats, setChats] = useState<AuraChat[]>([]);
  const [messages, setMessages] = useState<AuraMessage[]>([]);
  const [contacts, setContacts] = useState<AuraContact[]>([]);
  const [selectedChat, setSelectedChat] = useState<AuraChat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showSuccess, showError } = useAdvancedNotifications();

  // Carregar chats
  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular chamada de API
      const mockChats: AuraChat[] = [
        {
          id: '1',
          phone_number: '+5511999999999',
          contact_name: 'João Silva',
          contact_avatar: 'https://via.placeholder.com/40',
          status: 'active',
          last_message: {
            id: '1',
            chat_id: '1',
            direction: 'inbound',
            type: 'text',
            content: 'Olá, como posso ajudar?',
            status: 'read',
            timestamp: new Date().toISOString(),
            retry_count: 0,
            metadata: {}
          },
          last_activity: new Date().toISOString(),
          unread_count: 0,
          connection_id: 'conn1',
          flow_id: 'flow1',
          tags: ['cliente', 'vip'],
          notes: 'Cliente importante',
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setChats(mockChats);
      showSuccess('Chats carregados com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar chats';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar mensagens de um chat
  const fetchMessages = useCallback(async (chatId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular chamada de API
      const mockMessages: AuraMessage[] = [
        {
          id: '1',
          chat_id: chatId,
          direction: 'inbound',
          type: 'text',
          content: 'Olá, como posso ajudar?',
          status: 'read',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          retry_count: 0,
          metadata: {}
        },
        {
          id: '2',
          chat_id: chatId,
          direction: 'outbound',
          type: 'text',
          content: 'Olá! Bem-vindo ao nosso atendimento.',
          status: 'delivered',
          timestamp: new Date().toISOString(),
          retry_count: 0,
          metadata: {}
        }
      ];
      
      setMessages(mockMessages);
      showSuccess('Mensagens carregadas com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar mensagens';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Enviar mensagem
  const sendMessage = useCallback(async (chatId: string, content: string, type: MessageType = 'text') => {
    setLoading(true);
    setError(null);
    
    try {
      const newMessage: AuraMessage = {
        id: Date.now().toString(),
        chat_id: chatId,
        direction: 'outbound',
        type,
        content,
        status: 'sent',
        timestamp: new Date().toISOString(),
        retry_count: 0,
        metadata: {}
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Atualizar último mensagem do chat
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { 
              ...chat, 
              last_message: newMessage,
              last_activity: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          : chat
      ));
      
      showSuccess('Mensagem enviada com sucesso!');
      return newMessage;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao enviar mensagem';
      setError(errorMessage);
      showError('Erro', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar contatos
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular chamada de API
      const mockContacts: AuraContact[] = [
        {
          id: '1',
          phone_number: '+5511999999999',
          name: 'João Silva',
          avatar: 'https://via.placeholder.com/40',
          email: 'joao@email.com',
          company: 'Empresa ABC',
          tags: ['cliente', 'vip'],
          notes: 'Cliente importante',
          last_seen: new Date().toISOString(),
          is_blocked: false,
          is_archived: false,
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];
      
      setContacts(mockContacts);
      showSuccess('Contatos carregados com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao carregar contatos';
      setError(errorMessage);
      showError('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Criar contato
  const createContact = useCallback(async (contactData: Partial<AuraContact>) => {
    setLoading(true);
    setError(null);
    
    try {
      const newContact: AuraContact = {
        id: Date.now().toString(),
        phone_number: contactData.phone_number || '',
        name: contactData.name || '',
        avatar: contactData.avatar,
        email: contactData.email,
        company: contactData.company,
        tags: contactData.tags || [],
        notes: contactData.notes,
        last_seen: new Date().toISOString(),
        is_blocked: false,
        is_archived: false,
        metadata: contactData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setContacts(prev => [newContact, ...prev]);
      showSuccess('Contato criado com sucesso!');
      return newContact;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar contato';
      setError(errorMessage);
      showError('Erro', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar contato
  const updateContact = useCallback(async (id: string, contactData: Partial<AuraContact>) => {
    setLoading(true);
    setError(null);
    
    try {
      setContacts(prev => prev.map(contact => 
        contact.id === id 
          ? { ...contact, ...contactData, updated_at: new Date().toISOString() }
          : contact
      ));
      
      showSuccess('Contato atualizado com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar contato';
      setError(errorMessage);
      showError('Erro', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Arquivar chat
  const archiveChat = useCallback(async (id: string) => {
    try {
      setChats(prev => prev.map(chat => 
        chat.id === id 
          ? { ...chat, status: 'archived', updated_at: new Date().toISOString() }
          : chat
      ));
      
      showSuccess('Chat arquivado com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao arquivar chat';
      setError(errorMessage);
      showError('Erro', errorMessage);
    }
  }, []);

  // Bloquear chat
  const blockChat = useCallback(async (id: string) => {
    try {
      setChats(prev => prev.map(chat => 
        chat.id === id 
          ? { ...chat, status: 'blocked', updated_at: new Date().toISOString() }
          : chat
      ));
      
      showSuccess('Chat bloqueado com sucesso!');
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao bloquear chat';
      setError(errorMessage);
      showError('Erro', errorMessage);
    }
  }, []);

  // Marcar mensagens como lidas
  const markMessagesAsRead = useCallback(async (chatId: string) => {
    try {
      setMessages(prev => prev.map(message => 
        message.chat_id === chatId && message.direction === 'inbound'
          ? { ...message, status: 'read', read_at: new Date().toISOString() }
          : message
      ));
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId 
          ? { ...chat, unread_count: 0, updated_at: new Date().toISOString() }
          : chat
      ));
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao marcar mensagens como lidas';
      setError(errorMessage);
      showError('Erro', errorMessage);
    }
  }, []);

  // Utilitários
  const getChatsByStatus = useCallback((status: ChatStatus) => {
    return chats.filter(chat => chat.status === status);
  }, [chats]);

  const getActiveChats = useCallback(() => {
    return chats.filter(chat => chat.status === 'active');
  }, [chats]);

  const getUnreadChats = useCallback(() => {
    return chats.filter(chat => chat.unread_count > 0);
  }, [chats]);

  const getChatById = useCallback((id: string) => {
    return chats.find(chat => chat.id === id);
  }, [chats]);

  const getMessagesByChat = useCallback((chatId: string) => {
    return messages.filter(message => message.chat_id === chatId);
  }, [messages]);

  const getContactByPhone = useCallback((phoneNumber: string) => {
    return contacts.find(contact => contact.phone_number === phoneNumber);
  }, [contacts]);

  const getChatStats = useCallback(() => {
    const total = chats.length;
    const active = chats.filter(c => c.status === 'active').length;
    const archived = chats.filter(c => c.status === 'archived').length;
    const blocked = chats.filter(c => c.status === 'blocked').length;
    const unread = chats.filter(c => c.unread_count > 0).length;
    
    return {
      total,
      active,
      archived,
      blocked,
      unread,
      activePercentage: total > 0 ? (active / total) * 100 : 0
    };
  }, [chats]);

  const getMessageStats = useCallback(() => {
    const total = messages.length;
    const inbound = messages.filter(m => m.direction === 'inbound').length;
    const outbound = messages.filter(m => m.direction === 'outbound').length;
    const unread = messages.filter(m => m.direction === 'inbound' && m.status !== 'read').length;
    
    return {
      total,
      inbound,
      outbound,
      unread,
      inboundPercentage: total > 0 ? (inbound / total) * 100 : 0
    };
  }, [messages]);

  // Inicialização
  useEffect(() => {
    fetchChats();
    fetchContacts();
  }, [fetchChats, fetchContacts]);

  return {
    // Estado
    chats,
    messages,
    contacts,
    selectedChat,
    loading,
    error,
    
    // Ações
    fetchChats,
    fetchMessages,
    sendMessage,
    fetchContacts,
    createContact,
    updateContact,
    archiveChat,
    blockChat,
    markMessagesAsRead,
    setSelectedChat,
    
    // Utilitários
    getChatsByStatus,
    getActiveChats,
    getUnreadChats,
    getChatById,
    getMessagesByChat,
    getContactByPhone,
    getChatStats,
    getMessageStats,
    
    // Controle de erro
    clearError: () => setError(null)
  };
};
