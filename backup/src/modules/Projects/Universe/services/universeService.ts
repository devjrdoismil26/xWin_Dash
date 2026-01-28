import { apiClient } from '@/services';

// ===== INTERFACES TYPESCRIPT NATIVAS =====
export interface UniverseInstance {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  configuration?: Record<string, any>;
  user_id: number;
  template_id?: number;
  project_id?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UniverseSnapshot {
  id: number;
  name: string;
  description?: string;
  instance_id: number;
  data: Record<string, any>;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface UniverseTemplate {
  id: number;
  name: string;
  description?: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  configuration: Record<string, any>;
  is_public: boolean;
  author_id: number;
  rating: number;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

export interface UniverseStats {
  total_instances: number;
  active_instances: number;
  total_templates: number;
  total_snapshots: number;
  recent_activity: number;
  ai_suggestions: number;
  automations_running: number;
  performance_metrics: {
    average_response_time: number;
    success_rate: number;
    error_rate: number;
  };
}

export interface UniverseFormData {
  name: string;
  description?: string;
  template_id?: number;
  project_id?: number;
  configuration?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface UniverseFilters {
  search?: string;
  status?: string[];
  template_id?: number;
  project_id?: number;
  user_id?: number;
  sortBy?: 'name' | 'created_at' | 'updated_at' | 'status';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  perPage?: number;
}

export interface UniverseActivity {
  id: number;
  instance_id: number;
  user_id: number;
  action: string;
  description: string;
  metadata?: any;
  created_at: string;
}

export interface UniverseBlock {
  id: string;
  type: string;
  name: string;
  configuration: Record<string, any>;
  position: { x: number; y: number };
  connections: string[];
  metadata?: Record<string, any>;
}

export interface UniverseCanvas {
  id: string;
  instance_id: number;
  name: string;
  blocks: UniverseBlock[];
  layout: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UniverseData {
  id: string;
  [key: string]: any;
}

export interface UniverseResponse {
  success: boolean;
  data?: UniverseData | UniverseData[];
  message?: string;
  error?: string;
}

class UniverseService {
  private api = apiClient;

  // ===== INSTANCE MANAGEMENT =====
  async getInstances(filters: UniverseFilters = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe', { params: filters });
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

  async getInstance(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.get(`/universe/${id}`);
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

  async createInstance(data: UniverseFormData): Promise<UniverseResponse> {
    try {
      const response = await this.api.post('/universe', data);
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

  async updateInstance(id: number, data: Partial<UniverseFormData>): Promise<UniverseResponse> {
    try {
      const response = await this.api.put(`/universe/${id}`, data);
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

  async deleteInstance(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.delete(`/universe/${id}`);
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

  // ===== INSTANCE ACTIONS =====
  async startInstance(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${id}/start`);
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

  async stopInstance(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${id}/stop`);
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

  async saveInstance(id: number, data?: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${id}/save`, data);
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

  async duplicateInstance(id: number, newName?: string): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${id}/duplicate`, { name: newName });
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

  // ===== SNAPSHOTS =====
  async getSnapshots(instanceId?: number, params: any = {}): Promise<UniverseResponse> {
    try {
      const url = instanceId ? `/universe/snapshots?instance_id=${instanceId}` : '/universe/snapshots';
      const response = await this.api.get(url, { params });
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

  async getSnapshot(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.get(`/universe/snapshots/${id}`);
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

  async createSnapshot(data: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post('/universe/snapshots', data);
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

  async restoreSnapshot(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/snapshots/${id}/restore`);
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

  async deleteSnapshot(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.delete(`/universe/snapshots/${id}`);
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

  // ===== TEMPLATES =====
  async getTemplates(filters: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/templates', { params: filters });
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

  async getTemplate(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.get(`/universe/templates/${id}`);
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

  async createTemplate(data: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post('/universe/templates', data);
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

  async updateTemplate(id: number, data: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.put(`/universe/templates/${id}`, data);
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

  async deleteTemplate(id: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.delete(`/universe/templates/${id}`);
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

  // ===== CANVAS & BLOCKS =====
  async getCanvas(instanceId: number): Promise<UniverseResponse> {
    try {
      const response = await this.api.get(`/universe/${instanceId}/canvas`);
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

  async updateCanvas(instanceId: number, canvas: UniverseCanvas): Promise<UniverseResponse> {
    try {
      const response = await this.api.put(`/universe/${instanceId}/canvas`, canvas);
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

  async addBlock(instanceId: number, block: UniverseBlock): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${instanceId}/blocks`, block);
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

  async updateBlock(instanceId: number, blockId: string, block: Partial<UniverseBlock>): Promise<UniverseResponse> {
    try {
      const response = await this.api.put(`/universe/${instanceId}/blocks/${blockId}`, block);
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

  async deleteBlock(instanceId: number, blockId: string): Promise<UniverseResponse> {
    try {
      const response = await this.api.delete(`/universe/${instanceId}/blocks/${blockId}`);
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

  // ===== ACTIVITIES =====
  async getInstanceActivities(id: number, params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get(`/universe/${id}/activities`, { params });
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

  async recordActivity(id: number, activity: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${id}/activities`, activity);
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

  // ===== STATISTICS =====
  async getUniverseStats(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/stats', { params });
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
  async getAnalyticsOverview(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/overview', { params });
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

  async getInstanceAnalytics(instanceId: number, params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get(`/universe/analytics/instances/${instanceId}`, { params });
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

  async getPerformanceAnalytics(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/performance', { params });
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

  async getUsageAnalytics(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/usage', { params });
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

  async getErrorAnalytics(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/errors', { params });
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

  async getTrendsAnalytics(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/trends', { params });
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

  async getAnalyticsExport(params: any = {}): Promise<Blob> {
    try {
      const response = await this.api.get('/universe/analytics/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getAnalyticsReports(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/reports', { params });
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

  async createAnalyticsReport(data: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post('/universe/analytics/reports', data);
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

  async getAnalyticsDashboards(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/dashboards', { params });
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

  async createAnalyticsDashboard(data: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post('/universe/analytics/dashboards', data);
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

  async getAnalyticsAlerts(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/alerts', { params });
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

  async createAnalyticsAlert(data: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post('/universe/analytics/alerts', data);
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

  async getAnalyticsHealth(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/health', { params });
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

  async getAnalyticsStatus(params: any = {}): Promise<UniverseResponse> {
    try {
      const response = await this.api.get('/universe/analytics/status', { params });
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

  // ===== AI & AUTOMATION =====
  async getAISuggestions(instanceId: number, context?: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${instanceId}/ai-suggestions`, context);
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

  async runAutomation(instanceId: number, automationId: string, params?: any): Promise<UniverseResponse> {
    try {
      const response = await this.api.post(`/universe/${instanceId}/automations/${automationId}/run`, params);
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

  async getAutomations(instanceId?: number): Promise<UniverseResponse> {
    try {
      const url = instanceId ? `/universe/${instanceId}/automations` : '/universe/automations';
      const response = await this.api.get(url);
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
  formatInstanceStatus(status: string): string {
    const statusMap: { [key: string]: string } = {
      active: 'Ativo',
      inactive: 'Inativo',
      suspended: 'Suspenso'
    };
    return statusMap[status] || status;
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      active: 'green',
      inactive: 'yellow',
      suspended: 'red'
    };
    return colorMap[status] || 'gray';
  }

  formatTemplateDifficulty(difficulty: string): string {
    const difficultyMap: { [key: string]: string } = {
      beginner: 'Iniciante',
      intermediate: 'Intermediário',
      advanced: 'Avançado'
    };
    return difficultyMap[difficulty] || difficulty;
  }

  getDifficultyColor(difficulty: string): string {
    const colorMap: { [key: string]: string } = {
      beginner: 'green',
      intermediate: 'yellow',
      advanced: 'red'
    };
    return colorMap[difficulty] || 'gray';
  }

  validateInstanceData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || data.name.trim().length === 0) {
      errors.push('Nome da instância é obrigatório');
    }

    if (data.name && data.name.length > 100) {
      errors.push('Nome da instância deve ter no máximo 100 caracteres');
    }

    if (data.description && data.description.length > 500) {
      errors.push('Descrição deve ter no máximo 500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  formatInstanceName(instance: any): string {
    return instance.name || 'Instância sem nome';
  }

  getInstanceInitials(instance: any): string {
    const name = this.formatInstanceName(instance);
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  calculateInstanceAge(instance: any): string {
    const created = new Date(instance.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 dia';
    if (diffDays < 30) return `${diffDays} dias`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses`;
    return `${Math.floor(diffDays / 365)} anos`;
  }

  getInstanceHealth(instance: any): 'healthy' | 'warning' | 'critical' {
    const updated = new Date(instance.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - updated.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (instance.status === 'active' && diffDays <= 7) return 'healthy';
    if (instance.status === 'active' && diffDays <= 30) return 'warning';
    if (instance.status === 'suspended') return 'critical';
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

  formatBlockType(type: string): string {
    const typeMap: { [key: string]: string } = {
      trigger: 'Gatilho',
      action: 'Ação',
      condition: 'Condição',
      loop: 'Loop',
      delay: 'Delay',
      webhook: 'Webhook',
      api: 'API',
      database: 'Banco de Dados',
      email: 'Email',
      sms: 'SMS',
      notification: 'Notificação'
    };
    return typeMap[type] || type;
  }

  getBlockTypeColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      trigger: 'blue',
      action: 'green',
      condition: 'yellow',
      loop: 'purple',
      delay: 'orange',
      webhook: 'red',
      api: 'indigo',
      database: 'teal',
      email: 'pink',
      sms: 'cyan',
      notification: 'gray'
    };
    return colorMap[type] || 'gray';
  }
}

export default new UniverseService();
