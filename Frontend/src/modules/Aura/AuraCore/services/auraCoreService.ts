/**
 * @module modules/Aura/AuraCore/services/auraCoreService
 * @description
 * Serviço principal do módulo AuraCore.
 * 
 * Orquestrador que coordena diferentes serviços especializados e fornece
 * uma interface unificada para:
 * - Gerenciamento de estatísticas
 * - Gerenciamento de módulos
 * - Execução de ações rápidas
 * - Gerenciamento de notificações
 * - Dados do dashboard
 * - Configurações do sistema
 * - Cache e performance
 * 
 * @example
 * ```typescript
 * import auraCoreService from './auraCoreService';
 * 
 * // Buscar estatísticas
 * const statsResponse = await auraCoreService.getStats();

 * 
 * // Atualizar módulo
 * const updateResponse = await auraCoreService.updateModule('module-id', { status: 'active' });

 * ```
 * 
 * @since 1.0.0
 */
import { AuraCoreServiceInterface } from '../types/auraCoreInterfaces';
import { AuraResponse } from '../types/auraCoreTypes';
import { getErrorMessage } from '@/utils/errorHelpers';
import { apiClient } from '@/services';

class AuraCoreService implements AuraCoreServiceInterface {
  private baseUrl = '/api/aura/core';

  // Estatísticas
  async getStats(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/stats`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch stats';
      return {
        success: false,
        error: errorMessage};

    } async updateStats(stats: Record<string, any>): Promise<AuraResponse> {
    try {
      const response = await apiClient.post(`/aura/core/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
  }) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to update stats';
      return {
        success: false,
        error: errorMessage};

    } // Módulos
  async getModules(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/modules`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch modules';
      return {
        success: false,
        error: errorMessage};

    } async updateModule(id: string, moduleData: Record<string, any>): Promise<AuraResponse> {
    try {
      const response = await apiClient.post(`/aura/core/modules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(moduleData)
  }) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to update module';
      return {
        success: false,
        error: errorMessage};

    } // Ações rápidas
  async getQuickActions(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/quick-actions`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch quick actions';
      return {
        success: false,
        error: errorMessage};

    } async executeQuickAction(id: string): Promise<AuraResponse> {
    try {
      const response = await apiClient.post(`/aura/core/quick-actions/${id}/execute`, {
        method: 'POST'
      }) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to execute quick action';
      return {
        success: false,
        error: errorMessage};

    } // Notificações
  async getNotifications(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/notifications`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch notifications';
      return {
        success: false,
        error: errorMessage};

    } async markNotificationAsRead(id: string): Promise<AuraResponse> {
    try {
      const response = await apiClient.post(`/aura/core/notifications/${id}/read`, {
        method: 'PUT'
      }) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to mark notification as read';
      return {
        success: false,
        error: errorMessage};

    } async clearNotifications(): Promise<AuraResponse> {
    try {
      const response = await apiClient.delete(`/aura/core/notifications`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to clear notifications';
      return {
        success: false,
        error: errorMessage};

    } // Dashboard
  async getDashboardData(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/dashboard`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch dashboard data';
      return {
        success: false,
        error: errorMessage};

    } async refreshDashboard(): Promise<AuraResponse> {
    try {
      const response = await apiClient.post(`/aura/core/dashboard/refresh`, {
        method: 'POST'
      }) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to refresh dashboard';
      return {
        success: false,
        error: errorMessage};

    } // Configuração
  async getConfig(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/config`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch config';
      return {
        success: false,
        error: errorMessage};

    } async updateConfig(config: Record<string, any>): Promise<AuraResponse> {
    try {
      const response = await apiClient.post(`/aura/core/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
  }) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to update config';
      return {
        success: false,
        error: errorMessage};

    } // Cache
  async clearCache(): Promise<void> {
    try {
      await apiClient.delete(`/aura/core/cache/clear`);

    } catch (error) {
      console.error('Failed to clear cache:', error);

    } async getCacheStatus(): Promise<AuraResponse> {
    try {
      const response = await apiClient.get(`/aura/core/cache/status`) as { data?: string; message?: string};

      return {
        success: true,
        data: (response as any).data,
        message: (response as any).message};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? getErrorMessage(error)
        : (error as { response?: { data?: { message?: string } })?.response?.data?.message || 'Failed to fetch cache status';
      return {
        success: false,
        error: errorMessage};

    } }

export default new AuraCoreService();
