/**
 * Service orquestrador principal para o módulo EmailMarketing
 * Coordena todos os serviços especializados
 */

import { EmailMarketingCoreService } from '../EmailMarketingCore/services/emailMarketingCoreService';
import { EmailCampaignsService } from '../EmailCampaigns/services/emailCampaignsService';
import { EmailTemplatesService } from '../EmailTemplates/services/emailTemplatesService';
import { EmailSegmentsService } from '../EmailSegments/services/emailSegmentsService';

export interface EmailMarketingDashboardData {
  campaigns: any[];
  templates: any[];
  segments: any[];
  metrics: any;
  stats: any;
  activities: any[];
}

export interface EmailMarketingResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

export class EmailMarketingService {
  private coreService = new EmailMarketingCoreService();
  private campaignsService = new EmailCampaignsService();
  private templatesService = new EmailTemplatesService();
  private segmentsService = new EmailSegmentsService();

  // ===== DASHBOARD DATA =====
  async getDashboardData(): Promise<EmailMarketingResponse> {
    try {
      const [campaigns, templates, segments, metrics, stats, activities] = await Promise.all([
        this.campaignsService.getCampaigns(),
        this.templatesService.getTemplates(),
        this.segmentsService.getSegments(),
        this.coreService.getMetrics(),
        this.coreService.getStats(),
        this.coreService.getRecentActivities()
      ]);

      const dashboardData: EmailMarketingDashboardData = {
        campaigns: campaigns.success ? campaigns.data : [],
        templates: templates.success ? templates.data : [],
        segments: segments.success ? segments.data : [],
        metrics: metrics.success ? metrics.data : null,
        stats: stats.success ? stats.data : null,
        activities: activities.success ? activities.data : []
      };

      return {
        success: true,
        data: dashboardData
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== CORE SERVICES =====
  get core() {
    return this.coreService;
  }

  get campaigns() {
    return this.campaignsService;
  }

  get templates() {
    return this.templatesService;
  }

  get segments() {
    return this.segmentsService;
  }

  // ===== UTILITY METHODS =====
  async refreshAllData(): Promise<EmailMarketingResponse> {
    try {
      await Promise.all([
        this.coreService.refreshMetrics(),
        this.campaignsService.getCampaigns(),
        this.templatesService.getTemplates(),
        this.segmentsService.getSegments()
      ]);

      return {
        success: true,
        data: { message: 'All data refreshed successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async exportAllData(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<EmailMarketingResponse> {
    try {
      const [campaigns, templates, segments, core] = await Promise.all([
        this.campaignsService.exportCampaigns(format),
        this.templatesService.exportTemplate('all', format),
        this.segmentsService.exportSegmentSubscribers('all', format),
        this.coreService.exportData(format)
      ]);

      return {
        success: true,
        data: {
          campaigns: campaigns.data,
          templates: templates.data,
          segments: segments.data,
          core: core.data
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getSystemHealth(): Promise<EmailMarketingResponse> {
    try {
      const [core, campaigns, templates, segments] = await Promise.all([
        this.coreService.healthCheck(),
        this.campaignsService.getCampaigns({ limit: 1 }),
        this.templatesService.getTemplates({ limit: 1 }),
        this.segmentsService.getSegments({ limit: 1 })
      ]);

      const healthStatus = {
        core: core.success,
        campaigns: campaigns.success,
        templates: templates.success,
        segments: segments.success,
        overall: core.success && campaigns.success && templates.success && segments.success
      };

      return {
        success: true,
        data: healthStatus
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async clearAllCache(): Promise<EmailMarketingResponse> {
    try {
      await this.coreService.clearCache();

      return {
        success: true,
        data: { message: 'All cache cleared successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkDeleteAll(type: 'campaigns' | 'templates' | 'segments', ids: string[]): Promise<EmailMarketingResponse> {
    try {
      let result;
      
      switch (type) {
        case 'campaigns':
          result = await this.campaignsService.bulkDeleteCampaigns(ids);
          break;
        case 'templates':
          result = await this.templatesService.bulkDeleteTemplates(ids);
          break;
        case 'segments':
          result = await this.segmentsService.bulkDeleteSegments(ids);
          break;
        default:
          throw new Error(`Invalid type: ${type}`);
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkUpdateAll(type: 'campaigns' | 'templates' | 'segments', ids: string[], updates: any): Promise<EmailMarketingResponse> {
    try {
      let result;
      
      switch (type) {
        case 'campaigns':
          result = await this.campaignsService.bulkUpdateCampaigns(ids, updates);
          break;
        case 'templates':
          result = await this.templatesService.bulkUpdateTemplates(ids, updates);
          break;
        case 'segments':
          result = await this.segmentsService.bulkUpdateSegments(ids, updates);
          break;
        default:
          throw new Error(`Invalid type: ${type}`);
      }

      return result;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== ANALYTICS =====
  async getComprehensiveAnalytics(): Promise<EmailMarketingResponse> {
    try {
      const [campaigns, templates, segments, core] = await Promise.all([
        this.campaignsService.getCampaigns(),
        this.templatesService.getTemplates(),
        this.segmentsService.getSegments(),
        this.coreService.getMetrics()
      ]);

      const analytics = {
        campaigns: {
          total: campaigns.success ? campaigns.data.length : 0,
          active: campaigns.success ? campaigns.data.filter((c: any) => c.status === 'active').length : 0,
          sent: campaigns.success ? campaigns.data.filter((c: any) => c.status === 'sent').length : 0
        },
        templates: {
          total: templates.success ? templates.data.length : 0,
          active: templates.success ? templates.data.filter((t: any) => t.is_active).length : 0,
          public: templates.success ? templates.data.filter((t: any) => t.is_public).length : 0
        },
        segments: {
          total: segments.success ? segments.data.length : 0,
          active: segments.success ? segments.data.filter((s: any) => s.is_active).length : 0,
          dynamic: segments.success ? segments.data.filter((s: any) => s.is_dynamic).length : 0
        },
        metrics: core.success ? core.data : null
      };

      return {
        success: true,
        data: analytics
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
export const emailMarketingService = new EmailMarketingService();
export default emailMarketingService;
