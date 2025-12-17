import { apiClient } from '@/services';
import { AuraChat, AuraMessage } from '@/types';

export const auraChatsService = {
  async getChats(params?: Record<string, any>) {
    return apiClient.get('/aura/chats', { params });

  },

  async getChat(id: number) {
    return apiClient.get(`/aura/chats/${id}`);

  },

  async createChat(data: Partial<AuraChat>) {
    return apiClient.post('/aura/chats', data);

  },

  async updateChat(id: number, data: Partial<AuraChat>) {
    return apiClient.put(`/aura/chats/${id}`, data);

  },

  async deleteChat(id: number) {
    return apiClient.delete(`/aura/chats/${id}`);

  },

  async getMessages(chatId: number, params?: Record<string, any>) {
    return apiClient.get(`/aura/chats/${chatId}/messages`, { params });

  },

  async sendMessage(chatId: number, data: Partial<AuraMessage>) {
    return apiClient.post(`/aura/chats/${chatId}/messages`, data);

  },

  async markAsRead(chatId: number) {
    return apiClient.post(`/aura/chats/${chatId}/mark-read`);

  } ;
