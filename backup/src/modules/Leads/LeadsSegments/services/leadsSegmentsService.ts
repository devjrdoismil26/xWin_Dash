// ========================================
// LEADS SEGMENTS SERVICE
// ========================================
// Serviço para segmentação de leads
// Máximo: 300 linhas

import { apiClient } from '@/services';
import {
  LeadSegment,
  SegmentCriteria,
  LeadSegmentRule,
  LeadFilters,
  LeadListResponse
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
// OPERAÇÕES DE SEGMENTOS
// ========================================

/**
 * Buscar todos os segmentos
 */
export const fetchSegments = async (): Promise<{ success: boolean; data: LeadSegment[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/segments`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segments fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching segments:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch segments'
    };
  }
};

/**
 * Buscar segmento por ID
 */
export const fetchSegmentById = async (id: number): Promise<{ success: boolean; data: LeadSegment; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/segments/${id}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching segment:', error);
    return {
      success: false,
      data: {} as LeadSegment,
      message: error.response?.data?.message || 'Failed to fetch segment'
    };
  }
};

/**
 * Criar novo segmento
 */
export const createSegment = async (data: Omit<LeadSegment, 'id' | 'created_at' | 'updated_at' | 'lead_count'>): Promise<{ success: boolean; data: LeadSegment; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/segments`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment created successfully'
    };
  } catch (error: any) {
    console.error('Error creating segment:', error);
    return {
      success: false,
      data: {} as LeadSegment,
      message: error.response?.data?.message || 'Failed to create segment'
    };
  }
};

/**
 * Atualizar segmento
 */
export const updateSegment = async (id: number, data: Partial<LeadSegment>): Promise<{ success: boolean; data: LeadSegment; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.put(`/projects/${projectId}/segments/${id}`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating segment:', error);
    return {
      success: false,
      data: {} as LeadSegment,
      message: error.response?.data?.message || 'Failed to update segment'
    };
  }
};

/**
 * Deletar segmento
 */
export const deleteSegment = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    await apiClient.delete(`/projects/${projectId}/segments/${id}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: 'Segment deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting segment:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete segment'
    };
  }
};

// ========================================
// CÁLCULO E PREVIEW DE SEGMENTOS
// ========================================

/**
 * Calcular leads de um segmento
 */
export const calculateSegment = async (id: number): Promise<{ success: boolean; data: { count: number; leads: any[] }; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/segments/${id}/calculate`, {}, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment calculated successfully'
    };
  } catch (error: any) {
    console.error('Error calculating segment:', error);
    return {
      success: false,
      data: { count: 0, leads: [] },
      message: error.response?.data?.message || 'Failed to calculate segment'
    };
  }
};

/**
 * Preview de leads de um segmento
 */
export const previewSegment = async (criteria: SegmentCriteria, limit: number = 10): Promise<{ success: boolean; data: any[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/segments/preview`, {
      criteria,
      limit
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment preview generated successfully'
    };
  } catch (error: any) {
    console.error('Error previewing segment:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to preview segment'
    };
  }
};

/**
 * Validar critérios de segmento
 */
export const validateSegmentCriteria = async (criteria: SegmentCriteria): Promise<{ success: boolean; data: { valid: boolean; errors: string[] }; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/segments/validate`, criteria, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment criteria validated successfully'
    };
  } catch (error: any) {
    console.error('Error validating segment criteria:', error);
    return {
      success: false,
      data: { valid: false, errors: ['Validation failed'] },
      message: error.response?.data?.message || 'Failed to validate segment criteria'
    };
  }
};

// ========================================
// REGRAS DE SEGMENTO
// ========================================

/**
 * Buscar regras de um segmento
 */
export const fetchSegmentRules = async (segmentId: number): Promise<{ success: boolean; data: LeadSegmentRule[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/segments/${segmentId}/rules`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment rules fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching segment rules:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch segment rules'
    };
  }
};

/**
 * Criar regra para um segmento
 */
export const createSegmentRule = async (segmentId: number, rule: Omit<LeadSegmentRule, 'id' | 'segment_id'>): Promise<{ success: boolean; data: LeadSegmentRule; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/segments/${segmentId}/rules`, rule, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment rule created successfully'
    };
  } catch (error: any) {
    console.error('Error creating segment rule:', error);
    return {
      success: false,
      data: {} as LeadSegmentRule,
      message: error.response?.data?.message || 'Failed to create segment rule'
    };
  }
};

/**
 * Atualizar regra de segmento
 */
export const updateSegmentRule = async (segmentId: number, ruleId: number, rule: Partial<LeadSegmentRule>): Promise<{ success: boolean; data: LeadSegmentRule; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.put(`/projects/${projectId}/segments/${segmentId}/rules/${ruleId}`, rule, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment rule updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating segment rule:', error);
    return {
      success: false,
      data: {} as LeadSegmentRule,
      message: error.response?.data?.message || 'Failed to update segment rule'
    };
  }
};

/**
 * Deletar regra de segmento
 */
export const deleteSegmentRule = async (segmentId: number, ruleId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    await apiClient.delete(`/projects/${projectId}/segments/${segmentId}/rules/${ruleId}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: 'Segment rule deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting segment rule:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete segment rule'
    };
  }
};

// ========================================
// LEADS DE SEGMENTO
// ========================================

/**
 * Buscar leads de um segmento
 */
export const fetchSegmentLeads = async (segmentId: number, filters?: LeadFilters): Promise<LeadListResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.per_page) params.append('per_page', filters.per_page.toString());
    if (filters?.sort_by) params.append('sort_by', filters.sort_by);
    if (filters?.sort_order) params.append('sort_order', filters.sort_order);

    const response = await apiClient.get(`/projects/${projectId}/segments/${segmentId}/leads?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Segment leads fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching segment leads:', error);
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
      message: error.response?.data?.message || 'Failed to fetch segment leads'
    };
  }
};

/**
 * Adicionar leads a um segmento
 */
export const addLeadsToSegment = async (segmentId: number, leadIds: number[]): Promise<{ success: boolean; data: { added: number; failed: number }; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/segments/${segmentId}/leads`, {
      lead_ids: leadIds
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads added to segment successfully'
    };
  } catch (error: any) {
    console.error('Error adding leads to segment:', error);
    return {
      success: false,
      data: { added: 0, failed: leadIds.length },
      message: error.response?.data?.message || 'Failed to add leads to segment'
    };
  }
};

/**
 * Remover leads de um segmento
 */
export const removeLeadsFromSegment = async (segmentId: number, leadIds: number[]): Promise<{ success: boolean; data: { removed: number; failed: number }; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.delete(`/projects/${projectId}/segments/${segmentId}/leads`, {
      data: { lead_ids: leadIds },
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads removed from segment successfully'
    };
  } catch (error: any) {
    console.error('Error removing leads from segment:', error);
    return {
      success: false,
      data: { removed: 0, failed: leadIds.length },
      message: error.response?.data?.message || 'Failed to remove leads from segment'
    };
  }
};

export default leadsSegmentsService;
