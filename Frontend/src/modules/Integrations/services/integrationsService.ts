import { apiClient } from '@/services';

// ===== INTERFACES TYPESCRIPT =====
export interface Integration {
  id: string;
  name: string;
  description: string;
  category: 'crm' | 'marketing' | 'analytics' | 'communication' | 'productivity' | 'ecommerce' | 'social' | 'other';
  provider: string;
  version: string;
  status: 'available' | 'installed' | 'active' | 'inactive' | 'error' | 'updating';
  configuration: Record<string, any>;
  credentials: Record<string, any>;
  permissions: string[];
  features: string[];
  pricing: {
    type: 'free' | 'freemium' | 'paid' | 'enterprise';
    cost?: number;
    currency?: string;
    period?: 'monthly' | 'yearly';
  };
  rating: number;
  reviews: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationConfig {
  id: string;
  integrationId: string;
  name: string;
  description: string;
  settings: Record<string, any>;
  isActive: boolean;
  lastSync?: string;
  syncStatus: 'success' | 'error' | 'pending' | 'never';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IntegrationTest {
  id: string;
  integrationId: string;
  testType: 'connection' | 'authentication' | 'permissions' | 'data_sync' | 'webhook' | 'api';
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details: Record<string, any>;
  executedAt: string;
  duration: number;
}

export interface IntegrationLog {
  id: string;
  integrationId: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  context: Record<string, any>;
  timestamp: string;
}

export interface IntegrationAnalytics {
  integrationId: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    dataTransferred: number;
    errors: number;
    uptime: number;
  };
  usage: {
    byDay: Array<{ date: string; requests: number; errors: number }>;
    byHour: Array<{ hour: number; requests: number; errors: number }>;
    byEndpoint: Array<{ endpoint: string; requests: number; errors: number }>;
  };
  performance: {
    responseTime: Array<{ timestamp: string; time: number }>;
    throughput: Array<{ timestamp: string; requests: number }>;
    errorRate: Array<{ timestamp: string; rate: number }>;
  };
}

export interface IntegrationMarketplace {
  categories: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    count: number;
  }>;
  featured: Integration[];
  popular: Integration[];
  recent: Integration[];
  searchResults: Integration[];
  filters: {
    category: string[];
    pricing: string[];
    rating: number[];
    status: string[];
  };
}

export interface IntegrationResponse {
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}

class IntegrationsService {
  private api = apiClient;

  // ===== AVAILABLE INTEGRATIONS =====
  async getAvailableIntegrations(params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/available', { params });
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

  async getIntegrationDetails(id: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/available/${id}`);
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

  async searchIntegrations(query: string, filters: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/search', { 
        params: { q: query, ...filters }
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

  // ===== INSTALLED INTEGRATIONS =====
  async getInstalledIntegrations(params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/installed', { params });
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

  async installIntegration(integrationId: string, config: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post('/integrations/install', {
        integration_id: integrationId,
        configuration: config
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

  async uninstallIntegration(integrationId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.delete(`/integrations/uninstall/${integrationId}`);
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

  // ===== INTEGRATION STATUS =====
  async getIntegrationStatus(integrationId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/status/${integrationId}`);
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

  async updateIntegrationStatus(integrationId: string, status: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post(`/integrations/status/${integrationId}`, { status });
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

  // ===== INTEGRATION CONFIGURATION =====
  async getIntegrationConfig(integrationId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/config/${integrationId}`);
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

  async updateIntegrationConfig(integrationId: string, config: any): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post(`/integrations/config/${integrationId}`, config);
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

  // ===== INTEGRATION TESTING =====
  async testIntegration(integrationId: string, testType: string = 'connection'): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/test/${integrationId}`, {
        params: { type: testType }
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

  async runIntegrationTest(integrationId: string, testData: any): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post(`/integrations/test/${integrationId}`, testData);
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

  async getIntegrationTests(integrationId: string, params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/${integrationId}/tests`, { params });
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

  // ===== INTEGRATION LOGS =====
  async getIntegrationLogs(integrationId: string, params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/logs/${integrationId}`, { params });
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

  async getIntegrationLog(logId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/logs/${logId}`);
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

  async clearIntegrationLogs(integrationId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.delete(`/integrations/logs/${integrationId}`);
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

  // ===== INTEGRATION ANALYTICS =====
  async getIntegrationAnalytics(integrationId: string, params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/analytics/${integrationId}`, { params });
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

  async getIntegrationsAnalytics(params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/analytics', { params });
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

  // ===== INTEGRATION EXPORT/IMPORT =====
  async exportIntegration(integrationId: string, format: string = 'json'): Promise<Blob> {
    try {
      const response = await this.api.get(`/integrations/export/${integrationId}`, {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async exportIntegrations(format: string = 'json'): Promise<Blob> {
    try {
      const response = await this.api.get('/integrations/export', {
        params: { format },
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async importIntegrations(file: File): Promise<IntegrationResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await this.api.post('/integrations/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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

  // ===== INTEGRATION MARKETPLACE =====
  async getMarketplace(params: any = {}): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/marketplace', { params });
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

  async getMarketplaceCategories(): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/marketplace/categories');
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

  async getFeaturedIntegrations(): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/marketplace/featured');
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

  async getPopularIntegrations(): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/marketplace/popular');
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

  async getRecentIntegrations(): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get('/integrations/marketplace/recent');
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

  // ===== INTEGRATION SYNC =====
  async syncIntegration(integrationId: string, force: boolean = false): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post(`/integrations/sync/${integrationId}`, { force });
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

  async syncAllIntegrations(): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post('/integrations/sync/all');
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

  async getSyncStatus(integrationId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/sync/status/${integrationId}`);
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

  // ===== INTEGRATION WEBHOOKS =====
  async getIntegrationWebhooks(integrationId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.get(`/integrations/webhooks/${integrationId}`);
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

  async createIntegrationWebhook(integrationId: string, webhookData: any): Promise<IntegrationResponse> {
    try {
      const response = await this.api.post(`/integrations/webhooks/${integrationId}`, webhookData);
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

  async updateIntegrationWebhook(integrationId: string, webhookId: string, webhookData: any): Promise<IntegrationResponse> {
    try {
      const response = await this.api.put(`/integrations/webhooks/${integrationId}/${webhookId}`, webhookData);
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

  async deleteIntegrationWebhook(integrationId: string, webhookId: string): Promise<IntegrationResponse> {
    try {
      const response = await this.api.delete(`/integrations/webhooks/${integrationId}/${webhookId}`);
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

  // ===== UTILITY METHODS =====
  formatIntegrationStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      available: 'Disponível',
      installed: 'Instalado',
      active: 'Ativo',
      inactive: 'Inativo',
      error: 'Erro',
      updating: 'Atualizando'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      available: 'blue',
      installed: 'yellow',
      active: 'green',
      inactive: 'gray',
      error: 'red',
      updating: 'orange'
    };
    return colorMap[status] || 'gray';
  }

  formatIntegrationCategory(category: string): string {
    const categoryMap: { [key: string]: string } = {
      crm: 'CRM',
      marketing: 'Marketing',
      analytics: 'Analytics',
      communication: 'Comunicação',
      productivity: 'Produtividade',
      ecommerce: 'E-commerce',
      social: 'Redes Sociais',
      other: 'Outros'
    };
    return categoryMap[category] || category;
  }

  getCategoryColor(category: string): string {
    const colorMap: { [key: string]: string } = {
      crm: 'blue',
      marketing: 'green',
      analytics: 'purple',
      communication: 'orange',
      productivity: 'yellow',
      ecommerce: 'red',
      social: 'pink',
      other: 'gray'
    };
    return colorMap[category] || 'gray';
  }

  formatPricing(pricing: any): string {
    if (pricing.type === 'free') return 'Gratuito';
    if (pricing.type === 'freemium') return 'Freemium';
    if (pricing.type === 'paid') {
      return `${pricing.cost} ${pricing.currency}/${pricing.period}`;
    }
    if (pricing.type === 'enterprise') return 'Enterprise';
    return 'N/A';
  }

  validateIntegrationConfig(config: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.name || config.name.trim().length === 0) {
      errors.push('Nome da configuração é obrigatório');
    }

    if (!config.integrationId) {
      errors.push('ID da integração é obrigatório');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatIntegrationName(integration: any): string {
    return integration.name || 'Integração sem nome';
  }

  getIntegrationInitials(integration: any): string {
    const name = this.formatIntegrationName(integration);
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  calculateIntegrationAge(integration: any): string {
    const created = new Date(integration.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  }

  getIntegrationHealth(integration: any): 'healthy' | 'warning' | 'critical' {
    if (integration.status === 'active' && !integration.errorMessage) return 'healthy';
    if (integration.status === 'inactive' || integration.errorMessage) return 'warning';
    if (integration.status === 'error') return 'critical';
    return 'warning';
  }

  getHealthColor(health: string): string {
    const colorMap: { [key: string]: string } = {
      healthy: 'green',
      warning: 'yellow',
      critical: 'red'
    };
    return colorMap[health] || 'gray';
  }
}

export default new IntegrationsService();
