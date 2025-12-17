/**
 * Service para o módulo EmailMarketingCore
 * Gerencia métricas, dashboard e funcionalidades básicas
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailMarketingMetrics, EmailMarketingStats, EmailMarketingDashboard, EmailMarketingResponse, EmailMarketingMetricsResponse, EmailMarketingDashboardResponse } from '../types';

/**
 * Classe EmailMarketingCoreService
 *
 * @description
 * Classe principal do serviço core do EmailMarketing.
 * Gerencia métricas, estatísticas, dashboard, cache e health check.
 *
 * @class EmailMarketingCoreService
 */
export class EmailMarketingCoreService {
  private api = apiClient;

  // ===== MÉTRICAS =====
  async getMetrics(): Promise<EmailMarketingMetricsResponse> {
    try {
      const response = await this.api.get('/email-marketing/metrics') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getStats(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/stats') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getDashboard(): Promise<EmailMarketingDashboardResponse> {
    try {
      const response = await this.api.get('/email-marketing/dashboard') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== CONFIGURAÇÕES =====
  async getSettings(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/settings') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async updateSettings(settings: Record<string, any>): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.put('/email-marketing/settings', settings) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== ATIVIDADES =====
  async getRecentActivities(limit: number = 10): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/activities', {
        params: { limit } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== EXPORTAÇÃO =====
  async exportData(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.post('/email-marketing/export', {
        format
      }, {
        responseType: 'blob'
      }) as { data: Blob};

      // Criar download do arquivo
      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = `email-marketing-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);

      document.body.removeChild(a);

      return {
        success: true,
        data: { message: 'Export completed successfully' } ;

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== NOTIFICAÇÕES =====
  async getNotifications(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/notifications') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async markNotificationAsRead(id: string): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.put(`/email-marketing/notifications/${id}/read`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== HEALTH CHECK =====
  async healthCheck(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/health') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== CACHE =====
  async clearCache(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.post('/email-marketing/cache/clear') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== UTILITÁRIOS =====
  async refreshMetrics(): Promise<EmailMarketingMetricsResponse> {
    try {
      const response = await this.api.post('/email-marketing/metrics/refresh') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getSystemStatus(): Promise<EmailMarketingResponse> {
    try {
      const response = await this.api.get('/email-marketing/system/status') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } }

// Instância singleton
export const emailMarketingCoreService = new EmailMarketingCoreService();

export default emailMarketingCoreService;
