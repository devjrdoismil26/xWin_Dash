/**
 * Service orquestrador principal para o módulo EmailMarketing
 *
 * @description
 * Coordena todos os serviços especializados do EmailMarketing, fornecendo
 * uma interface unificada para operações de dashboard, analytics, operações
 * em massa e gerenciamento de saúde do sistema.
 *
 * @module modules/EmailMarketing/services/emailMarketingService
 * @since 1.0.0
 */

import { EmailMarketingCoreService } from '../EmailMarketingCore/services/emailMarketingCoreService';
import { EmailCampaignsService } from '../EmailCampaigns/services/emailCampaignsService';
import { EmailTemplatesService } from '../EmailTemplates/services/emailTemplatesService';
import { EmailSegmentsService } from '../EmailSegments/services/emailSegmentsService';
import { EmailCampaign } from '../EmailCampaigns/types';
import { EmailTemplate } from '../EmailTemplates/types';
import { EmailSegment } from '../EmailSegments/types';
import { getErrorMessage } from '@/utils/errorHelpers';

/**
 * Dados do dashboard do EmailMarketing
 *
 * @interface EmailMarketingDashboardData
 * @property {EmailCampaign[]} campaigns - Lista de campanhas
 * @property {EmailTemplate[]} templates - Lista de templates
 * @property {EmailSegment[]} segments - Lista de segmentos
 * @property {Record<string, any>} [metrics] - Métricas do sistema
 * @property {Record<string, any>} [stats] - Estatísticas do sistema
 * @property {Array<Record<string, any>>} activities - Atividades recentes
 */
export interface EmailMarketingDashboardData {
  campaigns: EmailCampaign[];
  templates: EmailTemplate[];
  segments: EmailSegment[];
  metrics?: Record<string, any>;
  stats?: Record<string, any>;
  activities: Array<Record<string, any>>;
  [key: string]: unknown; }

/**
 * Resposta de serviços do EmailMarketing
 *
 * @interface EmailMarketingResponse
 * @property {boolean} success - Se a operação foi bem-sucedida
 * @property {Record<string, any>} [data] - Dados da resposta (opcional)
 * @property {string} [message] - Mensagem de sucesso (opcional)
 * @property {string} [error] - Mensagem de erro (opcional)
 */
export interface EmailMarketingResponse {
  success: boolean;
  data?: Record<string, any>;
  message?: string;
  error?: string; }

/**
 * Classe EmailMarketingService
 *
 * @description
 * Classe principal que orquestra todos os serviços especializados do EmailMarketing.
 * Gerencia dashboard, operações em massa, analytics e saúde do sistema.
 *
 * @class EmailMarketingService
 */
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
        activities: activities.success ? activities.data : []};

      return {
        success: true,
        data: dashboardData};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== CORE SERVICES =====
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
        data: { message: 'All data refreshed successfully' } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async exportAllData(format: 'json' | 'csv' | 'xlsx' = 'json'): Promise<EmailMarketingResponse> {
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
        } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getSystemHealth(): Promise<EmailMarketingResponse> {
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
        overall: core.success && campaigns.success && templates.success && segments.success};

      return {
        success: true,
        data: healthStatus};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async clearAllCache(): Promise<EmailMarketingResponse> {
    try {
      await this.coreService.clearCache();

      return {
        success: true,
        data: { message: 'All cache cleared successfully' } ;

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== BULK OPERATIONS =====
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async bulkUpdateAll(type: 'campaigns' | 'templates' | 'segments', ids: string[], updates: Record<string, any>): Promise<EmailMarketingResponse> {
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
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== ANALYTICS =====
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
          active: campaigns.success ? campaigns.data.filter((c: EmailCampaign) => c.status === 'active').length : 0,
          sent: campaigns.success ? campaigns.data.filter((c: EmailCampaign) => c.status === 'sent').length : 0
        },
        templates: {
          total: templates.success ? templates.data.length : 0,
          active: templates.success ? templates.data.filter((t: EmailTemplate) => t.is_active).length : 0,
          public: templates.success ? templates.data.filter((t: EmailTemplate) => t.is_public).length : 0
        },
        segments: {
          total: segments.success ? segments.data.length : 0,
          active: segments.success ? segments.data.filter((s: EmailSegment) => s.is_active).length : 0,
          dynamic: segments.success ? segments.data.filter((s: EmailSegment) => s.is_dynamic).length : 0
        },
        metrics: core.success ? core.data : null};

      return {
        success: true,
        data: analytics};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } }

// Instância singleton
export const emailMarketingService = new EmailMarketingService();

export const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('currentProjectId');};

export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('authToken');

  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default emailMarketingService;
