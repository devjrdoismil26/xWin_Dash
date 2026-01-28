// ========================================
// LEADS MANAGER SERVICE
// ========================================
// Serviço para gerenciamento avançado de leads
// Máximo: 300 linhas

import { apiClient } from '@/services';
import {
  Lead,
  LeadFormData,
  LeadFilters,
  LeadActivity,
  LeadNote,
  LeadTask,
  LeadDocument,
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
// AÇÕES AVANÇADAS DE LEADS
// ========================================

/**
 * Atualizar status de um lead
 */
export const updateLeadStatus = async (id: number, status: string, reason?: string): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.patch(`/projects/${projectId}/leads/${id}/status`, {
      status,
      reason
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead status updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating lead status:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to update lead status'
    };
  }
};

/**
 * Atualizar score de um lead
 */
export const updateLeadScore = async (id: number, score: number, reason?: string): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.patch(`/projects/${projectId}/leads/${id}/score`, {
      score,
      reason
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead score updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating lead score:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to update lead score'
    };
  }
};

/**
 * Atribuir lead a um usuário
 */
export const assignLead = async (id: number, userId: number): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.patch(`/projects/${projectId}/leads/${id}/assign`, {
      assigned_to: userId
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead assigned successfully'
    };
  } catch (error: any) {
    console.error('Error assigning lead:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to assign lead'
    };
  }
};

/**
 * Desatribuir lead
 */
export const unassignLead = async (id: number): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.patch(`/projects/${projectId}/leads/${id}/unassign`, {}, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead unassigned successfully'
    };
  } catch (error: any) {
    console.error('Error unassigning lead:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to unassign lead'
    };
  }
};

/**
 * Duplicar lead
 */
export const duplicateLead = async (id: number): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/${id}/duplicate`, {}, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Lead duplicated successfully'
    };
  } catch (error: any) {
    console.error('Error duplicating lead:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to duplicate lead'
    };
  }
};

/**
 * Mesclar leads
 */
export const mergeLeads = async (primaryId: number, secondaryId: number, mergedData: Partial<Lead>): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/merge`, {
      primary_id: primaryId,
      secondary_id: secondaryId,
      merged_data: mergedData
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads merged successfully'
    };
  } catch (error: any) {
    console.error('Error merging leads:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to merge leads'
    };
  }
};

// ========================================
// NOTAS E TAREFAS
// ========================================

/**
 * Criar nota para um lead
 */
export const createLeadNote = async (leadId: number, content: string, isPrivate: boolean = false): Promise<{ success: boolean; data: LeadNote; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/${leadId}/notes`, {
      content,
      is_private: isPrivate
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Note created successfully'
    };
  } catch (error: any) {
    console.error('Error creating lead note:', error);
    return {
      success: false,
      data: {} as LeadNote,
      message: error.response?.data?.message || 'Failed to create note'
    };
  }
};

/**
 * Buscar notas de um lead
 */
export const fetchLeadNotes = async (leadId: number): Promise<{ success: boolean; data: LeadNote[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/notes`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Notes fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead notes:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch notes'
    };
  }
};

/**
 * Criar tarefa para um lead
 */
export const createLeadTask = async (leadId: number, task: Omit<LeadTask, 'id' | 'lead_id' | 'created_at' | 'updated_at'>): Promise<{ success: boolean; data: LeadTask; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/${leadId}/tasks`, task, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Task created successfully'
    };
  } catch (error: any) {
    console.error('Error creating lead task:', error);
    return {
      success: false,
      data: {} as LeadTask,
      message: error.response?.data?.message || 'Failed to create task'
    };
  }
};

/**
 * Buscar tarefas de um lead
 */
export const fetchLeadTasks = async (leadId: number): Promise<{ success: boolean; data: LeadTask[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/tasks`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Tasks fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead tasks:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch tasks'
    };
  }
};

// ========================================
// DOCUMENTOS
// ========================================

/**
 * Upload de documento para um lead
 */
export const uploadLeadDocument = async (leadId: number, file: File): Promise<{ success: boolean; data: LeadDocument; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/projects/${projectId}/leads/${leadId}/documents`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    });

    return {
      success: true,
      data: response.data,
      message: 'Document uploaded successfully'
    };
  } catch (error: any) {
    console.error('Error uploading lead document:', error);
    return {
      success: false,
      data: {} as LeadDocument,
      message: error.response?.data?.message || 'Failed to upload document'
    };
  }
};

/**
 * Buscar documentos de um lead
 */
export const fetchLeadDocuments = async (leadId: number): Promise<{ success: boolean; data: LeadDocument[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/documents`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Documents fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching lead documents:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch documents'
    };
  }
};

/**
 * Deletar documento de um lead
 */
export const deleteLeadDocument = async (leadId: number, documentId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    await apiClient.delete(`/projects/${projectId}/leads/${leadId}/documents/${documentId}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: 'Document deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting lead document:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete document'
    };
  }
};

// ========================================
// BUSCA AVANÇADA
// ========================================

/**
 * Buscar leads com filtros avançados
 */
export const searchLeadsAdvanced = async (filters: LeadFilters): Promise<LeadListResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/leads/search`, filters, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Advanced search completed successfully'
    };
  } catch (error: any) {
    console.error('Error in advanced search:', error);
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
      message: error.response?.data?.message || 'Failed to perform advanced search'
    };
  }
};

/**
 * Buscar leads duplicados
 */
export const findDuplicateLeads = async (filters?: { email?: boolean; phone?: boolean; name?: boolean }): Promise<{ success: boolean; data: any[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/duplicates`, {
      params: filters,
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Duplicate leads found successfully'
    };
  } catch (error: any) {
    console.error('Error finding duplicate leads:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to find duplicate leads'
    };
  }
};
