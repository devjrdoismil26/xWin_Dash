/**
 * @module modules/Aura/services/auraService
 * @description Orquestrador principal do módulo Aura - WhatsApp Integration
 */

import { auraConnectionsService } from './modules/auraConnectionsService';
import { auraChatsService } from './modules/auraChatsService';
import { auraFlowsService } from './modules/auraFlowsService';
import { auraAnalyticsService } from './modules/auraAnalyticsService';

// Export types for compatibility
export interface AuraConnection {
  id: string;
  name: string;
  phone: string;
  status: 'connected' | 'disconnected' | 'pending';
  qrCode?: string;
  createdAt: Date;
  updatedAt: Date; }

export interface AuraFlow {
  id: string;
  name: string;
  description?: string;
  trigger: string;
  actions: AuraFlowAction[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date; }

export interface AuraFlowAction {
  type: string;
  config: Record<string, any>;
  delay?: number; }

export interface AuraChat {
  id: string;
  connectionId: string;
  contactId: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date; }

export interface AuraResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const auraService = {
  ...auraConnectionsService,
  ...auraChatsService,
  ...auraFlowsService,
  ...auraAnalyticsService};

export default auraService;

export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');

  return token ? { Authorization: `Bearer ${token}` } : {};
};
