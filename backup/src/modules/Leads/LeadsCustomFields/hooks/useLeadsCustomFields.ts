// ========================================
// LEADS CUSTOM FIELDS HOOK
// ========================================
// Hook especializado para gerenciamento de campos customizados
// Máximo: 200 linhas

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import leadsCustomFieldsService from '../services/leadsCustomFieldsService';
import { LeadCustomField } from '../types';

interface UseLeadsCustomFieldsState {
  customFields: LeadCustomField[];
  currentCustomField: LeadCustomField | null;
  loading: boolean;
  error: string | null;
}

interface UseLeadsCustomFieldsActions {
  createCustomField: (data: Partial<LeadCustomField>) => Promise<LeadCustomField | null>;
  updateCustomField: (id: number, data: Partial<LeadCustomField>) => Promise<LeadCustomField | null>;
  deleteCustomField: (id: number) => Promise<boolean>;
  getCustomField: (id: number) => Promise<LeadCustomField | null>;
  fetchCustomFields: () => Promise<void>;
  refreshCustomFields: () => Promise<void>;
  setCurrentCustomField: (field: LeadCustomField | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useLeadsCustomFields = (): UseLeadsCustomFieldsState & UseLeadsCustomFieldsActions => {
  const [state, setState] = useState<UseLeadsCustomFieldsState>({
    customFields: [],
    currentCustomField: null,
    loading: false,
    error: null
  });

  // Actions
  const createCustomField = useCallback(async (data: Partial<LeadCustomField>): Promise<LeadCustomField | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsCustomFieldsService.createCustomField(data);
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          customFields: [...prev.customFields, result.data!],
          loading: false
        }));
        
        toast.success('Campo customizado criado com sucesso!');
        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao criar campo customizado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const updateCustomField = useCallback(async (id: number, data: Partial<LeadCustomField>): Promise<LeadCustomField | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsCustomFieldsService.updateCustomField(id, data);
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          customFields: prev.customFields.map(field => 
            field.id === id ? result.data! : field
          ),
          currentCustomField: prev.currentCustomField?.id === id ? result.data! : prev.currentCustomField,
          loading: false
        }));
        
        toast.success('Campo customizado atualizado com sucesso!');
        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao atualizar campo customizado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const deleteCustomField = useCallback(async (id: number): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsCustomFieldsService.deleteCustomField(id);
      
      if (result.success) {
        setState(prev => ({
          ...prev,
          customFields: prev.customFields.filter(field => field.id !== id),
          currentCustomField: prev.currentCustomField?.id === id ? null : prev.currentCustomField,
          loading: false
        }));
        
        toast.success('Campo customizado excluído com sucesso!');
        return true;
      } else {
        throw new Error(result.message || 'Erro ao excluir campo customizado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
      return false;
    }
  }, []);

  const getCustomField = useCallback(async (id: number): Promise<LeadCustomField | null> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsCustomFieldsService.getCustomField(id);
      
      if (result.success && result.data) {
        setState(prev => ({ ...prev, loading: false }));
        return result.data;
      } else {
        throw new Error(result.message || 'Erro ao buscar campo customizado');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
      return null;
    }
  }, []);

  const fetchCustomFields = useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await leadsCustomFieldsService.fetchCustomFields();
      
      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          customFields: result.data!,
          loading: false
        }));
      } else {
        throw new Error(result.message || 'Erro ao buscar campos customizados');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      toast.error(errorMessage);
    }
  }, []);

  const refreshCustomFields = useCallback(async (): Promise<void> => {
    await fetchCustomFields();
  }, [fetchCustomFields]);

  const setCurrentCustomField = useCallback((field: LeadCustomField | null) => {
    setState(prev => ({ ...prev, currentCustomField: field }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      customFields: [],
      currentCustomField: null,
      loading: false,
      error: null
    });
  }, []);

  // Initialize data on mount
  useEffect(() => {
    fetchCustomFields();
  }, [fetchCustomFields]);

  return {
    ...state,
    createCustomField,
    updateCustomField,
    deleteCustomField,
    getCustomField,
    fetchCustomFields,
    refreshCustomFields,
    setCurrentCustomField,
    clearError,
    reset
  };
};

export default useLeadsCustomFields;
