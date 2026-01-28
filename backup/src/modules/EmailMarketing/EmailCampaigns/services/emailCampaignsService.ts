/**
 * Service para o módulo EmailCampaigns
 * Gerencia campanhas de email
 */

import { apiClient } from '@/services';
import { 
  EmailCampaign, 
  CampaignFilters, 
  CampaignResponse,
  CampaignAnalytics,
  CampaignAnalyticsResponse 
} from '../types';

export class EmailCampaignsService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getCampaigns(filters?: CampaignFilters): Promise<CampaignResponse> {
    try {
      const response = await this.api.get('/email-campaigns', {
        params: filters
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createCampaign(campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.post('/email-campaigns', campaignData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateCampaign(id: string, campaignData: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.put(`/email-campaigns/${id}`, campaignData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.delete(`/email-campaigns/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async duplicateCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/duplicate`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== CAMPAIGN ACTIONS =====
  async sendCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/send`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async scheduleCampaign(id: string, scheduledAt: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/schedule`, {
        scheduled_at: scheduledAt
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async pauseCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/pause`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async resumeCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/resume`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async cancelCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/cancel`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TEST EMAILS =====
  async sendTestEmail(id: string, testEmails: string[]): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/test`, {
        test_emails: testEmails
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async previewCampaign(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/preview`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== ANALYTICS =====
  async getCampaignAnalytics(id: string): Promise<CampaignAnalyticsResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/analytics`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCampaignMetrics(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/metrics`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getCampaignLinks(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/links`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== A/B TESTING =====
  async createABTest(campaignData: any): Promise<CampaignResponse> {
    try {
      const response = await this.api.post('/email-campaigns/ab-test', campaignData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getABTestResults(id: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.get(`/email-campaigns/${id}/ab-test/results`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async selectABTestWinner(id: string, winnerVariant: string): Promise<CampaignResponse> {
    try {
      const response = await this.api.post(`/email-campaigns/${id}/ab-test/winner`, {
        winner_variant: winnerVariant
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkUpdateCampaigns(campaignIds: string[], updates: Partial<EmailCampaign>): Promise<CampaignResponse> {
    try {
      const response = await this.api.put('/email-campaigns/bulk-update', {
        campaign_ids: campaignIds,
        updates
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkDeleteCampaigns(campaignIds: string[]): Promise<CampaignResponse> {
    try {
      const response = await this.api.delete('/email-campaigns/bulk-delete', {
        data: { campaign_ids: campaignIds }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== EXPORT =====
  async exportCampaigns(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<CampaignResponse> {
    try {
      const response = await this.api.post('/email-campaigns/export', {
        format
      }, {
        responseType: 'blob'
      });
      
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
        data: { message: 'Export completed successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instância singleton
export const emailCampaignsService = new EmailCampaignsService();
export default emailCampaignsService;
