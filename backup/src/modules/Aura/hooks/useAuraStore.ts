/**
 * Store do módulo Aura usando Zustand com TypeScript
 * Gerenciamento de estado global para o módulo Aura
 */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import auraService from '../services/auraService';
import {
  AuraConnection,
  AuraFlow,
  AuraChat,
  AuraMessage,
  AuraTemplate,
  AuraWebhook,
  AuraAnalytics,
  AuraConnectionStatus,
  AuraFlowStatus,
  AuraChatStatus,
  AuraMessageType,
  AuraTemplateType,
  AuraWebhookStatus
} from '../types/auraTypes';

// Interface para o estado do store
interface AuraState {
  // Estado
  connections: AuraConnection[];
  flows: AuraFlow[];
  chats: AuraChat[];
  messages: AuraMessage[];
  templates: AuraTemplate[];
  webhooks: AuraWebhook[];
  analytics: AuraAnalytics | null;
  loading: boolean;
  error: string | null;
  currentView: string;
}

// Interface para as ações do store
interface AuraActions {
  // Ações para conexões
  fetchConnections: () => Promise<void>;
  createConnection: (connectionData: Partial<AuraConnection>) => Promise<any>;
  updateConnection: (id: string | number, connectionData: Partial<AuraConnection>) => Promise<any>;
  deleteConnection: (id: string | number) => Promise<void>;
  testConnection: (id: string | number) => Promise<any>;
  connectWhatsApp: (id: string | number) => Promise<any>;
  disconnectWhatsApp: (id: string | number) => Promise<any>;
  getConnectionStatistics: (id: string | number) => Promise<any>;

  // Ações para fluxos
  fetchFlows: () => Promise<void>;
  createFlow: (flowData: Partial<AuraFlow>) => Promise<any>;
  updateFlow: (id: string | number, flowData: Partial<AuraFlow>) => Promise<any>;
  deleteFlow: (id: string | number) => Promise<void>;
  executeFlow: (id: string | number, phoneNumber: string, variables?: Record<string, any>) => Promise<any>;
  pauseFlow: (id: string | number) => Promise<any>;
  resumeFlow: (id: string | number) => Promise<any>;

  // Ações para chats
  fetchChats: (params?: Record<string, any>) => Promise<void>;
  createChat: (chatData: Partial<AuraChat>) => Promise<any>;
  updateChat: (id: string | number, chatData: Partial<AuraChat>) => Promise<any>;
  deleteChat: (id: string | number) => Promise<void>;
  sendMessage: (chatId: string | number, message: string) => Promise<any>;
  getChatMessages: (chatId: string | number, params?: Record<string, any>) => Promise<any>;
  markAsRead: (chatId: string | number) => Promise<any>;
  closeChat: (chatId: string | number) => Promise<any>;

  // Ações para mensagens
  fetchMessages: (params?: Record<string, any>) => Promise<void>;
  sendBulkMessage: (phoneNumbers: string[], message: string, flowId?: string | number | null) => Promise<any>;
  scheduleMessage: (phoneNumber: string, message: string, scheduledAt: string, flowId?: string | number | null) => Promise<any>;

  // Ações para templates
  fetchTemplates: (params?: Record<string, any>) => Promise<void>;
  createTemplate: (templateData: Partial<AuraTemplate>) => Promise<any>;
  updateTemplate: (id: string | number, templateData: Partial<AuraTemplate>) => Promise<any>;
  deleteTemplate: (id: string | number) => Promise<void>;

  // Ações para webhooks
  fetchWebhooks: (params?: Record<string, any>) => Promise<void>;
  createWebhook: (webhookData: Partial<AuraWebhook>) => Promise<any>;
  updateWebhook: (id: string | number, webhookData: Partial<AuraWebhook>) => Promise<any>;
  deleteWebhook: (id: string | number) => Promise<void>;
  testWebhook: (id: string | number) => Promise<any>;

  // Ações para analytics
  fetchAnalytics: (params?: Record<string, any>) => Promise<any>;
  getConnectionAnalytics: (connectionId: string | number, params?: Record<string, any>) => Promise<any>;
  getFlowAnalytics: (flowId: string | number, params?: Record<string, any>) => Promise<any>;

  // Ações de teste de integração
  testConnection: () => Promise<{ success: boolean; error?: string }>;
  testFlowCreation: () => Promise<{ success: boolean; error?: string }>;
  testChatCreation: () => Promise<{ success: boolean; error?: string }>;
  testWebhookCreation: () => Promise<{ success: boolean; error?: string }>;

  // Métodos utilitários
  getActiveConnections: () => AuraConnection[];
  getActiveFlows: () => AuraFlow[];
  getActiveChats: () => AuraChat[];
  getUnreadChats: () => AuraChat[];
  getTotalMessages: () => number;
  getTotalConnections: () => number;
  getTotalFlows: () => number;
  getTotalChats: () => number;
  formatPhoneNumber: (phoneNumber: string) => string;
  validatePhoneNumber: (phoneNumber: string) => boolean;
  formatTimestamp: (timestamp: string) => string;
  calculateStats: (data: any) => any;

  // Ações de UI
  setCurrentView: (view: string) => void;
  clearError: () => void;
}

// Tipo combinado para o store
type AuraStore = AuraState & AuraActions;

// Estado inicial
const initialState: AuraState = {
  connections: [],
  flows: [],
  chats: [],
  messages: [],
  templates: [],
  webhooks: [],
  analytics: null,
  loading: false,
  error: null,
  currentView: 'overview',
};

// Store principal
const useAuraStore = create<AuraStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Ações para conexões
      fetchConnections: async () => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getConnections();
          set({ connections: data.data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      createConnection: async (connectionData: Partial<AuraConnection>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.createConnection(connectionData);
          set(state => ({ 
            connections: [...state.connections, data.data], 
            loading: false 
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateConnection: async (id: string | number, connectionData: Partial<AuraConnection>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.updateConnection(id, connectionData);
          set(state => ({
            connections: state.connections.map(connection => 
              connection.id === id ? data.data : connection
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteConnection: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          await auraService.deleteConnection(id);
          set(state => ({
            connections: state.connections.filter(connection => connection.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      testConnection: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.testConnection(id);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      connectWhatsApp: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.connectWhatsApp(id);
          set(state => ({
            connections: state.connections.map(connection => 
              connection.id === id ? { ...connection, status: 'active' as AuraConnectionStatus, is_active: true } : connection
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      disconnectWhatsApp: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.disconnectWhatsApp(id);
          set(state => ({
            connections: state.connections.map(connection => 
              connection.id === id ? { ...connection, status: 'inactive' as AuraConnectionStatus, is_active: false } : connection
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      getConnectionStatistics: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getConnectionStatistics(id);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações para fluxos
      fetchFlows: async () => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getFlows();
          set({ flows: data.data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      createFlow: async (flowData: Partial<AuraFlow>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.createFlow(flowData);
          set(state => ({ 
            flows: [...state.flows, data.data], 
            loading: false 
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateFlow: async (id: string | number, flowData: Partial<AuraFlow>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.updateFlow(id, flowData);
          set(state => ({
            flows: state.flows.map(flow => 
              flow.id === id ? data.data : flow
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteFlow: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          await auraService.deleteFlow(id);
          set(state => ({
            flows: state.flows.filter(flow => flow.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      executeFlow: async (id: string | number, phoneNumber: string, variables: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.executeFlow(id, phoneNumber, variables);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      pauseFlow: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.pauseFlow(id);
          set(state => ({
            flows: state.flows.map(flow => 
              flow.id === id ? { ...flow, status: 'inactive' as AuraFlowStatus, is_active: false } : flow
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      resumeFlow: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.resumeFlow(id);
          set(state => ({
            flows: state.flows.map(flow => 
              flow.id === id ? { ...flow, status: 'active' as AuraFlowStatus, is_active: true } : flow
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações para chats
      fetchChats: async (params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getChats(params);
          set({ chats: data.data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      createChat: async (chatData: Partial<AuraChat>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.createChat(chatData);
          set(state => ({ 
            chats: [...state.chats, data.data], 
            loading: false 
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateChat: async (id: string | number, chatData: Partial<AuraChat>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.updateChat(id, chatData);
          set(state => ({
            chats: state.chats.map(chat => 
              chat.id === id ? data.data : chat
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteChat: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          await auraService.deleteChat(id);
          set(state => ({
            chats: state.chats.filter(chat => chat.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      sendMessage: async (chatId: string | number, message: string) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.sendMessage(chatId, message);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      getChatMessages: async (chatId: string | number, params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getChatMessages(chatId, params);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      markAsRead: async (chatId: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.markAsRead(chatId);
          set(state => ({
            chats: state.chats.map(chat => 
              chat.id === chatId ? { ...chat, unread_count: 0 } : chat
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      closeChat: async (chatId: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.closeChat(chatId);
          set(state => ({
            chats: state.chats.map(chat => 
              chat.id === chatId ? { ...chat, status: 'closed' as AuraChatStatus } : chat
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações para mensagens
      fetchMessages: async (params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getMessages(params);
          set({ messages: data.data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      sendBulkMessage: async (phoneNumbers: string[], message: string, flowId: string | number | null = null) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.sendBulkMessage(phoneNumbers, message, flowId);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      scheduleMessage: async (phoneNumber: string, message: string, scheduledAt: string, flowId: string | number | null = null) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.scheduleMessage(phoneNumber, message, scheduledAt, flowId);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações para templates
      fetchTemplates: async (params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getTemplates(params);
          set({ templates: data.data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      createTemplate: async (templateData: Partial<AuraTemplate>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.createTemplate(templateData);
          set(state => ({ 
            templates: [...state.templates, data.data], 
            loading: false 
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateTemplate: async (id: string | number, templateData: Partial<AuraTemplate>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.updateTemplate(id, templateData);
          set(state => ({
            templates: state.templates.map(template => 
              template.id === id ? data.data : template
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteTemplate: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          await auraService.deleteTemplate(id);
          set(state => ({
            templates: state.templates.filter(template => template.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações para webhooks
      fetchWebhooks: async (params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getWebhooks(params);
          set({ webhooks: data.data || [], loading: false });
        } catch (error: any) {
          set({ error: error.message, loading: false });
        }
      },

      createWebhook: async (webhookData: Partial<AuraWebhook>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.createWebhook(webhookData);
          set(state => ({ 
            webhooks: [...state.webhooks, data.data], 
            loading: false 
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      updateWebhook: async (id: string | number, webhookData: Partial<AuraWebhook>) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.updateWebhook(id, webhookData);
          set(state => ({
            webhooks: state.webhooks.map(webhook => 
              webhook.id === id ? data.data : webhook
            ),
            loading: false
          }));
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      deleteWebhook: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          await auraService.deleteWebhook(id);
          set(state => ({
            webhooks: state.webhooks.filter(webhook => webhook.id !== id),
            loading: false
          }));
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      testWebhook: async (id: string | number) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.testWebhook(id);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações para analytics
      fetchAnalytics: async (params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getAnalytics(params);
          set({ analytics: data.data, loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      getConnectionAnalytics: async (connectionId: string | number, params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getConnectionAnalytics(connectionId, params);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      getFlowAnalytics: async (flowId: string | number, params: Record<string, any> = {}) => {
        set({ loading: true, error: null });
        try {
          const data = await auraService.getFlowAnalytics(flowId, params);
          set({ loading: false });
          return data;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      // Ações de teste de integração

      testFlowCreation: async () => {
        set({ loading: true, error: null });
        try {
          const result = await auraService.testFlowCreation();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      testChatCreation: async () => {
        set({ loading: true, error: null });
        try {
          const result = await auraService.testChatCreation();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      testWebhookCreation: async () => {
        set({ loading: true, error: null });
        try {
          const result = await auraService.testWebhookCreation();
          set({ loading: false });
          return result;
        } catch (error: any) {
          set({ error: error.message, loading: false });
          return { success: false, error: error.message };
        }
      },

      // Métodos utilitários
      getActiveConnections: () => {
        const { connections } = get();
        return connections.filter(connection => connection.is_active || connection.status === 'active');
      },

      getActiveFlows: () => {
        const { flows } = get();
        return flows.filter(flow => flow.is_active || flow.status === 'active');
      },

      getActiveChats: () => {
        const { chats } = get();
        return chats.filter(chat => chat.status === 'active');
      },

      getUnreadChats: () => {
        const { chats } = get();
        return chats.filter(chat => chat.unread_count > 0);
      },

      getTotalMessages: () => {
        const { analytics } = get();
        return analytics?.total_messages || 0;
      },

      getTotalConnections: () => {
        const { connections } = get();
        return connections.length;
      },

      getTotalFlows: () => {
        const { flows } = get();
        return flows.length;
      },

      getTotalChats: () => {
        const { chats } = get();
        return chats.length;
      },

      formatPhoneNumber: (phoneNumber: string) => {
        return auraService.formatPhoneNumber(phoneNumber);
      },

      validatePhoneNumber: (phoneNumber: string) => {
        return auraService.validatePhoneNumber(phoneNumber);
      },

      formatTimestamp: (timestamp: string) => {
        return auraService.formatTimestamp(timestamp);
      },

      calculateStats: (data: any) => {
        return auraService.calculateStats(data);
      },

      // Ações de UI
      setCurrentView: (view: string) => set({ currentView: view }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'aura-store'
    }
  )
);

export default useAuraStore;
