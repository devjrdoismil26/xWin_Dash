// Service Types Extensions

export interface BaseService {
  get?: (id: string) => Promise<any>;
  getAll?: (filters?: string) => Promise<any>;
  create?: (data: unknown) => Promise<any>;
  update?: (id: string, data: unknown) => Promise<any>;
  delete?: (id: string) => Promise<any>;
  search?: (query: string) => Promise<any>; }

export interface AdsAnalyticsService extends BaseService {
  getAnalyticsSummary?: (filters?: string) => Promise<any>;
  getTotalSpend?: (filters?: string) => Promise<number>;
  getTotalImpressions?: (filters?: string) => Promise<number>;
  getTotalClicks?: (filters?: string) => Promise<number>;
  getTotalConversions?: (filters?: string) => Promise<number>;
  getPerformanceInsights?: (filters?: string) => Promise<any>;
  getReportStatus?: (reportId: string) => Promise<any>;
  getPausedCampaigns?: () => Promise<unknown[]>;
  getActiveCampaigns?: () => Promise<unknown[]>;
  getCampaignMetrics?: (campaignId: string) => Promise<any>;
  getAccountMetrics?: (accountId: string) => Promise<any>;
  exportReport?: (format: string) => Promise<any>;
  scheduleReport?: (config: unknown) => Promise<any>;
  getHistoricalData?: (range: unknown) => Promise<any>;
}

export interface AdsCreativeService extends BaseService {
  uploadMedia?: (file: File) => Promise<any>;
  generatePreview?: (creativeId: string) => Promise<any>;
  duplicateCreative?: (creativeId: string) => Promise<any>;
  pauseCreative?: (creativeId: string) => Promise<any>;
  resumeCreative?: (creativeId: string) => Promise<any>;
  getCreativePerformance?: (creativeId: string) => Promise<any>;
}

export interface AdsTemplateService extends BaseService {
  importTemplate?: (templateId: string) => Promise<any>;
  exportTemplate?: (templateId: string) => Promise<any>;
  duplicateTemplate?: (templateId: string) => Promise<any>;
  applyTemplate?: (templateId: string, data: unknown) => Promise<any>;
  getTemplateCategories?: () => Promise<unknown[]>;
  searchTemplates?: (query: string) => Promise<unknown[]>;
}

export interface LeadsService extends BaseService {
  importLeads?: (file: File) => Promise<any>;
  exportLeads?: (filters?: string) => Promise<any>;
  mergLeads?: (leadIds: string[]) => Promise<any>;
  assignLead?: (leadId: string, userId: string) => Promise<any>;
  updateLeadScore?: (leadId: string, score: number) => Promise<any>;
  addLeadNote?: (leadId: string, note: string) => Promise<any>;
  addLeadTag?: (leadId: string, tag: string) => Promise<any>;
  removeLeadTag?: (leadId: string, tagId: string) => Promise<any>;
  getLeadHistory?: (leadId: string) => Promise<unknown[]>;
  getLeadActivities?: (leadId: string) => Promise<unknown[]>;
}

export interface AnalyticsService extends BaseService {
  getMetrics?: (filters?: string) => Promise<any>;
  getReports?: (filters?: string) => Promise<any>;
  createReport?: (data: unknown) => Promise<any>;
  updateReport?: (id: string, data: unknown) => Promise<any>;
  deleteReport?: (id: string) => Promise<any>;
  exportReport?: (id: string, format: string) => Promise<any>;
  scheduleReport?: (config: unknown) => Promise<any>;
  getDashboardData?: (filters?: string) => Promise<any>;
}

export interface MediaService extends BaseService {
  uploadFile?: (file: File) => Promise<any>;
  uploadFiles?: (files: File[]) => Promise<any>;
  deleteFile?: (fileId: string) => Promise<any>;
  getFileUrl?: (fileId: string) => Promise<string>;
  generateThumbnail?: (fileId: string) => Promise<string>;
  optimizeImage?: (fileId: string) => Promise<any>;
  getMediaLibrary?: (filters?: string) => Promise<any>;
}

export interface WorkflowService extends BaseService {
  executeWorkflow?: (workflowId: string, data?: string) => Promise<any>;
  pauseWorkflow?: (workflowId: string) => Promise<any>;
  resumeWorkflow?: (workflowId: string) => Promise<any>;
  getWorkflowStatus?: (workflowId: string) => Promise<any>;
  getWorkflowLogs?: (workflowId: string) => Promise<unknown[]>;
  validateWorkflow?: (workflow: unknown) => Promise<any>;
}
