// ========================================
// LEADS CUSTOM FIELDS SERVICE
// ========================================
// Serviço para campos customizados de leads
// Máximo: 300 linhas

import { apiClient } from '@/services';
import {
  LeadCustomField,
  Lead,
  LeadFormData,
  LeadResponse
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
// OPERAÇÕES DE CAMPOS CUSTOMIZADOS
// ========================================

/**
 * Buscar todos os campos customizados
 */
export const fetchCustomFields = async (): Promise<{ success: boolean; data: LeadCustomField[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/custom-fields`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom fields fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching custom fields:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch custom fields'
    };
  }
};

/**
 * Buscar campo customizado por ID
 */
export const fetchCustomFieldById = async (id: number): Promise<{ success: boolean; data: LeadCustomField; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/custom-fields/${id}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching custom field:', error);
    return {
      success: false,
      data: {} as LeadCustomField,
      message: error.response?.data?.message || 'Failed to fetch custom field'
    };
  }
};

/**
 * Criar novo campo customizado
 */
export const createCustomField = async (data: Omit<LeadCustomField, 'id'>): Promise<{ success: boolean; data: LeadCustomField; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/custom-fields`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field created successfully'
    };
  } catch (error: any) {
    console.error('Error creating custom field:', error);
    return {
      success: false,
      data: {} as LeadCustomField,
      message: error.response?.data?.message || 'Failed to create custom field'
    };
  }
};

/**
 * Atualizar campo customizado
 */
export const updateCustomField = async (id: number, data: Partial<LeadCustomField>): Promise<{ success: boolean; data: LeadCustomField; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.put(`/projects/${projectId}/custom-fields/${id}`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating custom field:', error);
    return {
      success: false,
      data: {} as LeadCustomField,
      message: error.response?.data?.message || 'Failed to update custom field'
    };
  }
};

/**
 * Deletar campo customizado
 */
export const deleteCustomField = async (id: number): Promise<{ success: boolean; message: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    await apiClient.delete(`/projects/${projectId}/custom-fields/${id}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      message: 'Custom field deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting custom field:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to delete custom field'
    };
  }
};

// ========================================
// VALIDAÇÃO E CONFIGURAÇÃO
// ========================================

/**
 * Validar configuração de campo customizado
 */
export const validateCustomField = async (data: Omit<LeadCustomField, 'id'>): Promise<{ success: boolean; data: { valid: boolean; errors: string[] }; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/custom-fields/validate`, data, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field validated successfully'
    };
  } catch (error: any) {
    console.error('Error validating custom field:', error);
    return {
      success: false,
      data: { valid: false, errors: ['Validation failed'] },
      message: error.response?.data?.message || 'Failed to validate custom field'
    };
  }
};

/**
 * Testar campo customizado com dados de exemplo
 */
export const testCustomField = async (id: number, testValue: any): Promise<{ success: boolean; data: { valid: boolean; errors: string[] }; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/custom-fields/${id}/test`, {
      value: testValue
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field tested successfully'
    };
  } catch (error: any) {
    console.error('Error testing custom field:', error);
    return {
      success: false,
      data: { valid: false, errors: ['Test failed'] },
      message: error.response?.data?.message || 'Failed to test custom field'
    };
  }
};

// ========================================
// DADOS DE CAMPOS CUSTOMIZADOS
// ========================================

/**
 * Atualizar valor de campo customizado em um lead
 */
export const updateLeadCustomFieldValue = async (leadId: number, fieldId: number, value: any): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.patch(`/projects/${projectId}/leads/${leadId}/custom-fields/${fieldId}`, {
      value
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field value updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating custom field value:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to update custom field value'
    };
  }
};

/**
 * Buscar valores de campos customizados de um lead
 */
export const fetchLeadCustomFieldValues = async (leadId: number): Promise<{ success: boolean; data: Record<string, any>; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/leads/${leadId}/custom-fields`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field values fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching custom field values:', error);
    return {
      success: false,
      data: {},
      message: error.response?.data?.message || 'Failed to fetch custom field values'
    };
  }
};

/**
 * Atualizar múltiplos valores de campos customizados
 */
export const updateLeadCustomFields = async (leadId: number, values: Record<string, any>): Promise<LeadResponse> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.patch(`/projects/${projectId}/leads/${leadId}/custom-fields`, {
      values
    }, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom fields updated successfully'
    };
  } catch (error: any) {
    console.error('Error updating custom fields:', error);
    return {
      success: false,
      data: {} as Lead,
      message: error.response?.data?.message || 'Failed to update custom fields'
    };
  }
};

// ========================================
// IMPORTAÇÃO E EXPORTAÇÃO
// ========================================

/**
 * Importar campos customizados de template
 */
export const importCustomFieldsFromTemplate = async (templateData: any): Promise<{ success: boolean; data: LeadCustomField[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.post(`/projects/${projectId}/custom-fields/import`, templateData, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom fields imported successfully'
    };
  } catch (error: any) {
    console.error('Error importing custom fields:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to import custom fields'
    };
  }
};

/**
 * Exportar campos customizados para template
 */
export const exportCustomFieldsToTemplate = async (fieldIds?: number[]): Promise<{ success: boolean; data: any; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = fieldIds ? `?fields=${fieldIds.join(',')}` : '';
    const response = await apiClient.get(`/projects/${projectId}/custom-fields/export${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom fields exported successfully'
    };
  } catch (error: any) {
    console.error('Error exporting custom fields:', error);
    return {
      success: false,
      data: {},
      message: error.response?.data?.message || 'Failed to export custom fields'
    };
  }
};

// ========================================
// ESTATÍSTICAS E RELATÓRIOS
// ========================================

/**
 * Buscar estatísticas de uso de campos customizados
 */
export const fetchCustomFieldStats = async (): Promise<{ success: boolean; data: any; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const response = await apiClient.get(`/projects/${projectId}/custom-fields/stats`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Custom field stats fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching custom field stats:', error);
    return {
      success: false,
      data: {},
      message: error.response?.data?.message || 'Failed to fetch custom field stats'
    };
  }
};

/**
 * Buscar leads que usam um campo customizado específico
 */
export const fetchLeadsUsingCustomField = async (fieldId: number, filters?: { value?: any; operator?: string }): Promise<{ success: boolean; data: Lead[]; message?: string }> => {
  try {
    const projectId = getCurrentProjectId();
    if (!projectId) {
      throw new Error('Project ID not found');
    }

    const params = new URLSearchParams();
    if (filters?.value !== undefined) params.append('value', filters.value.toString());
    if (filters?.operator) params.append('operator', filters.operator);

    const response = await apiClient.get(`/projects/${projectId}/custom-fields/${fieldId}/leads?${params}`, {
      headers: getAuthHeaders()
    });

    return {
      success: true,
      data: response.data,
      message: 'Leads using custom field fetched successfully'
    };
  } catch (error: any) {
    console.error('Error fetching leads using custom field:', error);
    return {
      success: false,
      data: [],
      message: error.response?.data?.message || 'Failed to fetch leads using custom field'
    };
  }
};

export default leadsCustomFieldsService;
