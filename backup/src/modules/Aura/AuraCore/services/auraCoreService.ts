/**
 * Serviço principal do módulo AuraCore
 * Orquestrador que coordena diferentes serviços especializados
 */
import { AuraCoreServiceInterface, AuraResponse } from '../types';

class AuraCoreService implements AuraCoreServiceInterface {
  private baseUrl = '/api/aura/core';

  // Estatísticas
  async getStats(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch stats');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch stats'
      };
    }
  }

  async updateStats(stats: any): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/stats`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update stats');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update stats'
      };
    }
  }

  // Módulos
  async getModules(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/modules`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch modules');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch modules'
      };
    }
  }

  async updateModule(id: string, data: any): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/modules/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update module');
      }
      
      return {
        success: true,
        data: result.data,
        message: result.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update module'
      };
    }
  }

  // Ações rápidas
  async getQuickActions(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quick-actions`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch quick actions');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch quick actions'
      };
    }
  }

  async executeQuickAction(id: string): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/quick-actions/${id}/execute`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to execute quick action');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to execute quick action'
      };
    }
  }

  // Notificações
  async getNotifications(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch notifications');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch notifications'
      };
    }
  }

  async markNotificationAsRead(id: string): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${id}/read`, {
        method: 'PUT'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to mark notification as read');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to mark notification as read'
      };
    }
  }

  async clearNotifications(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to clear notifications');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to clear notifications'
      };
    }
  }

  // Dashboard
  async getDashboardData(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch dashboard data');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch dashboard data'
      };
    }
  }

  async refreshDashboard(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/dashboard/refresh`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to refresh dashboard');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to refresh dashboard'
      };
    }
  }

  // Configuração
  async getConfig(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/config`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch config');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch config'
      };
    }
  }

  async updateConfig(config: any): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update config');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to update config'
      };
    }
  }

  // Cache
  async clearCache(): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/cache/clear`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  async getCacheStatus(): Promise<AuraResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/cache/status`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch cache status');
      }
      
      return {
        success: true,
        data: data.data,
        message: data.message
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to fetch cache status'
      };
    }
  }
}

export default new AuraCoreService();
