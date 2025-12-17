/**
 * Serviço de Campanhas de EmailMarketing
 *
 * @description
 * Serviço para o módulo EmailCampaigns gerenciando campanhas de email.
 * Gerencia CRUD de campanhas, analytics, envio e operações em massa.
 *
 * @module modules/EmailMarketing/EmailCampaigns/services/emailCampaignsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailCampaign, CampaignFilters, CampaignResponse, CampaignAnalytics, CampaignAnalyticsResponse } from '../types';

export class EmailCampaignsService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getCampaigns(filters?: CampaignFilters): Promise<CampaignResponse> {
    try {
      const response = await this.api.get('/email-campaigns', {
        params: filters
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async createCampaign(campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.post('/email-campaigns', campaignData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async updateCampaign(id: string, campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.put(`/email-campaigns/${id}`, campaignData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async deleteCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.delete(`/email-campaigns/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async duplicateCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/duplicate`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== CAMPAIGN ACTIONS =====
  async sendCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/send`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async scheduleCampaign(id: string, scheduledAt: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/schedule`, {
        scheduled_at: scheduledAt
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async pauseCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/pause`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async resumeCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/resume`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async cancelCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/cancel`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== TEST EMAILS =====
  async sendTestEmail(id: string, testEmails: string[]): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/test`, {
        test_emails: testEmails
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async previewCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/preview`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== ANALYTICS =====
  async getCampaignAnalytics(id: string): Promise<CampaignAnalyticsResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/analytics`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getCampaignMetrics(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/metrics`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getCampaignLinks(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/links`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== A/B TESTING =====
  async createABTest(campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.post('/email-campaigns/ab-test', campaignData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getABTestResults(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/ab-test/results`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async selectABTestWinner(id: string, winnerVariant: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/ab-test/winner`, {
        winner_variant: winnerVariant
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== BULK OPERATIONS =====
  async bulkUpdateCampaigns(campaignIds: string[], updates: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.put('/email-campaigns/bulk-update', {
        campaign_ids: campaignIds,
        updates
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async bulkDeleteCampaigns(campaignIds: string[]): Promise<CampaignResponse> {
    try {
      const response = await this.api.delete('/email-campaigns/bulk-delete', {
        data: { campaign_ids: campaignIds } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== EXPORT =====
  async exportCampaigns(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<CampaignResponse> {
    try {
      const response = await this.api.post('/email-campaigns/export', {
        format
      }, {
        responseType: 'blob'
      }) as { data: Blob};

      // Criar download do arquivo
      const blob = new Blob([response.data]);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');

      a.href = url;
      a.download = `campaigns-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);

      a.click();

      window.URL.revokeObjectURL(url);

      document.body.removeChild(a);

      return {
        success: true,
        data: { message: 'Export completed successfully' } ;

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } }

// Instância singleton
export const emailCampaignsService = new EmailCampaignsService();

export default emailCampaignsService;
