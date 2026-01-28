// ========================================
// LEADS CORE SERVICE
// ========================================
// Serviço para operações básicas do módulo Leads
// Máximo: 300 linhas

import { apiClient } from '@/services';
import {
  Lead,
  LeadFilters,
  LeadFormData,
  LeadActivity,
  LeadResponse,
  LeadListResponse,
  LeadBulkResponse
} from '../types';

// ========================================
// CONFIGURAÇÃO E UTILITÁRIOS
// ========================================

const getCurrentProjectId = (): string | null => {
  return localStorage.getItem('current_project_id');
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ========================================
// OPERAÇÕES BÁSICAS DE LEADS
// ========================================

/**
 * Buscar leads com filtros
 */
export const fetchLeads = async (filters: LeadFilters = {}): Promise<LeadListResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    
    // Adicionar filtros aos parâmetros
    if (filters.search) params.append('search', filters.search);
    if (filters.status?.length) params.append('status', filters.status.join(','));
    if (filters.origin?.length) params.append('origin', filters.origin.join(','));
    if (filters.tags?.length) params.append('tags', filters.tags.join(','));
    if (filters.assigned_to?.length) params.append('assigned_to', filters.assigned_to.join(','));
    if (filters.score_range) {
      params.append('score_min', filters.score_range.min.toString());
      params.append('score_max', filters.score_range.max.toString());
    }
    if (filters.date_range) {
      params.append('date_field', filters.date_range.field);
      params.append('date_start', filters.date_range.start);
      params.append('date_end', filters.date_range.end);
    }
    if (filters.sort_by) params.append('sort_by', filters.sort_by);
    if (filters.sort_order) params.append('sort_order', filters.sort_order);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await apiClient.get(`/projects/${projectId}/leads?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    return {
      success: false,
      data: {
        leads: [],
        pagination: {
          current_page: 1,
          total_pages: 1,
          total_items: 0,
          items_per_page: 10
        }
      },
      message: error.response?.data?.message || 'Failed to fetch leads'
    };
  }
};

/**
 * Buscar lead por ID
 */
export const fetchLeadById = async (id: number): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${id}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to fetch lead'
    };
  }
};

/**
 * Criar novo lead
 */
export const createLead = async (data: LeadFormData): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead created successfully'
    };
  } catch (error: any) {
    console.error('Error creating lead:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to create lead'
    };
  }
};

/**
 * Atualizar lead
 */
export const updateLead = async (id: number, data: Partial<LeadFormData>): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.put(`/projects/${projectId}/leads/${id}`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating lead:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to update lead'
    };
  }
};

/**
 * Deletar lead
 */
export const deleteLead = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    await apiClient.delete(`/projects/${projectId}/leads/${id}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: 'Lead deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting lead:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete lead'
    };
  }
};

// ========================================
// OPERAÇÕES EM LOTE
// ========================================

/**
 * Atualizar múltiplos leads
 */
export const bulkUpdateLeads = async (ids: number[], data: Partial<LeadFormData>): Promise<LeadBulkResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.put(`/projects/${projectId}/leads/bulk-update`, {
      ids,
      data
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads updated successfully'
    };
  } catch (error: any) {
    console.error('Error bulk updating leads:', error);
    return {
      success: false,
      data: {
        processed: 0,
        successful: 0,
        failed: ids.length,
        errors: ids.map(id => ({ id, error: 'Failed to update' }))
      },
      message: error.response?.data?.message || 'Failed to bulk update leads'
    };
  }
};

/**
 * Deletar múltiplos leads
 */
export const bulkDeleteLeads = async (ids: number[]): Promise<LeadBulkResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.delete(`/projects/${projectId}/leads/bulk-delete`, {
      data: { ids },
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads deleted successfully'
    };
  } catch (error: any) {
    console.error('Error bulk deleting leads:', error);
    return {
      success: false,
      data: {
        processed: 0,
        successful: 0,
        failed: ids.length,
        errors: ids.map(id => ({ id, error: 'Failed to delete' }))
      },
      message: error.response?.data?.message || 'Failed to bulk delete leads'
    };
  }
};

// ========================================
// ATIVIDADES
// ========================================

/**
 * Buscar atividades de um lead
 */
export const fetchLeadActivities = async (leadId: number): Promise<{ success: boolean; data: LeadActivity[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/activities`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Activities fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead activities:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch activities'
    };
  }
};

/**
 * Criar atividade para um lead
 */
export const createLeadActivity = async (leadId: number, activity: Omit<LeadActivity, 'id' | 'lead_id' | 'created_at'>): Promise<{ success: boolean; data: LeadActivity; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/${leadId}/activities`, activity, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Activity created successfully'
    };
  } catch (error: any) {
    console.error('Error creating lead activity:', error);
    return {
      success: false,
      data: {} as LeadActivity,
      message: error.response?.data?.message || 'Failed to create activity'
    };
  }
};

// ========================================
// UTILITÁRIOS
// ========================================

/**
 * Verificar se o projeto está ativo
 */
export const checkProjectStatus = async (): Promise<{ success: boolean; active: boolean; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      return { success: false, active: false, message: 'Project ID not found' };
    }

    const response = await apiClient.get(`/projects/${projectId}/status`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      active: response.data.active,
      message: 'Project status checked successfully'
    };
  } catch (error: any) {
    console.error('Error checking project status:', error);
    return {
      success: false,
      active: false,
      message: error.response?.data?.message || 'Failed to check project status'
    };
  }
};

/**
 * Obter configurações do projeto
 */
export const getProjectSettings = async (): Promise<{ success: boolean; data: any; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/settings`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Project settings fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching project settings:', error);
    return {
      success: false,
      data: {},
      message: error.response?.data?.message || 'Failed to fetch project settings'
    };
  }
};
