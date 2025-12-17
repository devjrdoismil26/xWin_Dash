import { useState, useCallback } from 'react';
import { useApiState } from './shared/useApiState';
import { leadCaptureFormsApi } from '../services/productsApiService';
import type { LeadCaptureForm, FormsFilter } from '../types';

export const useLeadCaptureForms = () => {
  const [forms, setForms] = useState<LeadCaptureForm[]>([]);

  const currentForm = useApiState<LeadCaptureForm>();

  const { loading, error, execute } = useApiState();

  const getAll = useCallback((filters?: FormsFilter) => 
    execute(() => leadCaptureFormsApi.getAll(filters), setForms), [execute]);

  const getById = useCallback((id: string) => 
    currentForm.execute(() => leadCaptureFormsApi.getById(id)), [currentForm]);

  const create = useCallback((data: unknown) => 
    execute(() => leadCaptureFormsApi.create(data), (newForm: unknown) => setForms(prev => [...prev, newForm])), [execute]);

  const update = useCallback((id: string, data: unknown) => 
    execute(() => leadCaptureFormsApi.update(id, data), (updated: unknown) => setForms(prev => prev.map(f => f.id === id ? updated : f))), [execute]);

  const remove = useCallback((id: string) => 
    execute(() => leadCaptureFormsApi.delete(id), () => setForms(prev => prev.filter(f => f.id !== id))), [execute]);

  const getSubmissions = useCallback((id: string) => 
    execute(() => leadCaptureFormsApi.getSubmissions(id)), [execute]);

  return {
    forms,
    currentForm: currentForm.data,
    loading: loading || currentForm.loading,
    error: error || currentForm.error,
    getAll,
    getById,
    create,
    update,
    remove,
    getSubmissions};
};
