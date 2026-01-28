// ========================================
// PRODUCTS MODULE - LEAD CAPTURE FORMS HOOK
// ========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
  LeadCaptureForm, 
  LeadCaptureFormsResponse, 
  FormsFilter, 
  CreateFormData, 
  UpdateFormData,
  FormStatus,
  FieldType,
  FormField,
  FormSettings,
  FormStyling
} from '../types/products';

interface UseLeadCaptureFormsOptions {
  initialFilters?: FormsFilter;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseLeadCaptureFormsReturn {
  // Data
  forms: LeadCaptureForm[];
  loading: boolean;
  error: string | null;
  
  // Filters & Search
  filters: FormsFilter;
  setFilters: (filters: FormsFilter) => void;
  updateFilter: (key: keyof FormsFilter, value: any) => void;
  clearFilters: () => void;
  
  // CRUD Operations
  createForm: (data: CreateFormData) => Promise<LeadCaptureForm>;
  updateForm: (id: string, data: UpdateFormData) => Promise<LeadCaptureForm>;
  deleteForm: (id: string) => Promise<void>;
  duplicateForm: (id: string) => Promise<LeadCaptureForm>;
  publishForm: (id: string) => Promise<LeadCaptureForm>;
  unpublishForm: (id: string) => Promise<LeadCaptureForm>;
  
  // Field Management
  addField: (id: string, field: FormField) => Promise<LeadCaptureForm>;
  updateField: (id: string, fieldId: string, field: FormField) => Promise<LeadCaptureForm>;
  removeField: (id: string, fieldId: string) => Promise<LeadCaptureForm>;
  reorderFields: (id: string, fieldIds: string[]) => Promise<LeadCaptureForm>;
  
  // Settings Management
  updateSettings: (id: string, settings: FormSettings) => Promise<LeadCaptureForm>;
  updateStyling: (id: string, styling: FormStyling) => Promise<LeadCaptureForm>;
  
  // Bulk Operations
  bulkUpdate: (ids: string[], updates: Partial<UpdateFormData>) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkPublish: (ids: string[]) => Promise<void>;
  bulkUnpublish: (ids: string[]) => Promise<void>;
  
  // Utilities
  refresh: () => Promise<void>;
  getForm: (id: string) => LeadCaptureForm | undefined;
  getFormsByStatus: (status: FormStatus) => LeadCaptureForm[];
  searchForms: (query: string) => LeadCaptureForm[];
  getPublishedForms: () => LeadCaptureForm[];
  getDraftForms: () => LeadCaptureForm[];
  
  // Analytics
  getAnalytics: (id: string) => Promise<any>;
  getConversionRate: (id: string) => Promise<number>;
  getSubmissions: (id: string, timeRange?: string) => Promise<any>;
  getFieldAnalytics: (id: string) => Promise<any>;
  
  // Form Validation
  validateForm: (id: string, data: Record<string, any>) => Promise<ValidationResult>;
  submitForm: (id: string, data: Record<string, any>) => Promise<SubmissionResult>;
  
  // Pagination
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

interface SubmissionResult {
  success: boolean;
  message: string;
  data?: any;
  errors?: Record<string, string>;
}

export const useLeadCaptureForms = (options: UseLeadCaptureFormsOptions = {}): UseLeadCaptureFormsReturn => {
  const { initialFilters = {}, autoRefresh = false, refreshInterval = 30000 } = options;
  
  // Using router directly for API calls
  
  // State
  const [forms, setForms] = useState<LeadCaptureForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FormsFilter>(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch forms
  const fetchForms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/lead-capture-forms?' + new URLSearchParams({
        ...filters,
        page: pagination.currentPage.toString(),
        per_page: pagination.perPage.toString()
      }));
      const data = await response.json() as LeadCaptureFormsResponse;
      
      if (data) {
        setForms(data.data);
        setPagination(prev => ({
          ...prev,
          currentPage: data.meta.currentPage,
          lastPage: data.meta.lastPage,
          total: data.meta.total,
          hasNextPage: data.meta.currentPage < data.meta.lastPage,
          hasPrevPage: data.meta.currentPage > 1
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch forms');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  // Initial load
  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchForms();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchForms]);

  // Filter handlers
  const updateFilter = useCallback((key: keyof FormsFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // CRUD operations
  const createForm = useCallback(async (data: CreateFormData): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch('/api/lead-capture-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newForm = await response.json() as LeadCaptureForm;
      
      if (newForm) {
        setForms(prev => [newForm, ...prev]);
        return newForm;
      }
      
      throw new Error('Failed to create form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateForm = useCallback(async (id: string, data: UpdateFormData): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedForm = await response.json() as LeadCaptureForm;
      
      if (updatedForm) {
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to update form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const deleteForm = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await fetch(`/api/lead-capture-forms/${id}`, { method: 'DELETE' });
      
      setForms(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateForm = useCallback(async (id: string): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/duplicate`, { method: 'POST' });
      const duplicatedForm = await response.json() as LeadCaptureForm;
      
      if (duplicatedForm) {
        setForms(prev => [duplicatedForm, ...prev]);
        return duplicatedForm;
      }
      
      throw new Error('Failed to duplicate form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishForm = useCallback(async (id: string): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/publish`, { method: 'POST' });
      const publishedForm = await response.json() as LeadCaptureForm;
      
      if (publishedForm) {
        setForms(prev => prev.map(f => f.id === id ? publishedForm : f));
        return publishedForm;
      }
      
      throw new Error('Failed to publish form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unpublishForm = useCallback(async (id: string): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/unpublish`, { method: 'POST' });
      const unpublishedForm = await response.json() as LeadCaptureForm;
      
      if (unpublishedForm) {
        setForms(prev => prev.map(f => f.id === id ? unpublishedForm : f));
        return unpublishedForm;
      }
      
      throw new Error('Failed to unpublish form');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish form');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Field management
  const addField = useCallback(async (id: string, field: FormField): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/fields`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field })
      });
      const updatedForm = await response.json() as LeadCaptureForm;
      
      if (updatedForm) {
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to add field');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add field');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateField = useCallback(async (id: string, fieldId: string, field: FormField): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/fields/${fieldId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field })
      });
      const updatedForm = await response.json() as LeadCaptureForm;
      
      if (updatedForm) {
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to update field');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const removeField = useCallback(async (id: string, fieldId: string): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await del(`/api/lead-capture-forms/${id}/fields/${fieldId}`);
      
      if (response.data) {
        const updatedForm = response.data as LeadCaptureForm;
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to remove field');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove field');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderFields = useCallback(async (id: string, fieldIds: string[]): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/fields/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fieldIds })
      });
      const updatedForm = await response.json() as LeadCaptureForm;
      
      if (updatedForm) {
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to reorder fields');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder fields');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Settings management
  const updateSettings = useCallback(async (id: string, settings: FormSettings): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      });
      const updatedForm = await response.json() as LeadCaptureForm;
      
      if (updatedForm) {
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to update settings');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const updateStyling = useCallback(async (id: string, styling: FormStyling): Promise<LeadCaptureForm> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/lead-capture-forms/${id}/styling`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ styling })
      });
      const updatedForm = await response.json() as LeadCaptureForm;
      
      if (updatedForm) {
        setForms(prev => prev.map(f => f.id === id ? updatedForm : f));
        return updatedForm;
      }
      
      throw new Error('Failed to update styling');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update styling');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Bulk operations
  const bulkUpdate = useCallback(async (ids: string[], updates: Partial<UpdateFormData>): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/lead-capture-forms/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, updates })
      });
      
      setForms(prev => prev.map(f => 
        ids.includes(f.id) ? { ...f, ...updates } : f
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update forms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/lead-capture-forms/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      setForms(prev => prev.filter(f => !ids.includes(f.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk delete forms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkPublish = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/lead-capture-forms/bulk-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      setForms(prev => prev.map(f => 
        ids.includes(f.id) ? { ...f, status: FormStatus.PUBLISHED } : f
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk publish forms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUnpublish = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/lead-capture-forms/bulk-unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      setForms(prev => prev.map(f => 
        ids.includes(f.id) ? { ...f, status: FormStatus.DRAFT } : f
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk unpublish forms');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utilities
  const refresh = useCallback(async () => {
    await fetchForms();
  }, [fetchForms]);

  const getForm = useCallback((id: string): LeadCaptureForm | undefined => {
    return forms.find(f => f.id === id);
  }, [forms]);

  const getFormsByStatus = useCallback((status: FormStatus): LeadCaptureForm[] => {
    return forms.filter(f => f.status === status);
  }, [forms]);

  const searchForms = useCallback((query: string): LeadCaptureForm[] => {
    if (!query.trim()) return forms;
    
    const lowercaseQuery = query.toLowerCase();
    return forms.filter(f => 
      f.name.toLowerCase().includes(lowercaseQuery) ||
      f.title.toLowerCase().includes(lowercaseQuery) ||
      f.description.toLowerCase().includes(lowercaseQuery) ||
      f.slug.toLowerCase().includes(lowercaseQuery)
    );
  }, [forms]);

  const getPublishedForms = useCallback((): LeadCaptureForm[] => {
    return forms.filter(f => f.status === FormStatus.PUBLISHED);
  }, [forms]);

  const getDraftForms = useCallback((): LeadCaptureForm[] => {
    return forms.filter(f => f.status === FormStatus.DRAFT);
  }, [forms]);

  // Analytics
  const getAnalytics = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/lead-capture-forms/${id}/analytics`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      throw err;
    }
  }, []);

  const getConversionRate = useCallback(async (id: string): Promise<number> => {
    try {
      const response = await fetch(`/api/lead-capture-forms/${id}/conversion-rate`);
      const data = await response.json();
      return data.conversionRate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversion rate');
      throw err;
    }
  }, []);

  const getSubmissions = useCallback(async (id: string, timeRange?: string): Promise<any> => {
    try {
      const response = await fetch(`/api/lead-capture-forms/${id}/submissions?timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch submissions');
      throw err;
    }
  }, []);

  const getFieldAnalytics = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/lead-capture-forms/${id}/field-analytics`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch field analytics');
      throw err;
    }
  }, []);

  // Form validation
  const validateForm = useCallback(async (id: string, data: Record<string, any>): Promise<ValidationResult> => {
    try {
      const response = await fetch(`/api/lead-capture-forms/${id}/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to validate form');
      throw err;
    }
  }, []);

  const submitForm = useCallback(async (id: string, data: Record<string, any>): Promise<SubmissionResult> => {
    try {
      const response = await fetch(`/api/lead-capture-forms/${id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data })
      });
      const result = await response.json();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
      throw err;
    }
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  }, [pagination.lastPage]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  }, [pagination.hasPrevPage]);

  // Memoized values
  const memoizedPagination = useMemo(() => ({
    ...pagination,
    goToPage,
    nextPage,
    prevPage
  }), [pagination, goToPage, nextPage, prevPage]);

  return {
    // Data
    forms,
    loading,
    error,
    
    // Filters & Search
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    
    // CRUD Operations
    createForm,
    updateForm,
    deleteForm,
    duplicateForm,
    publishForm,
    unpublishForm,
    
    // Field Management
    addField,
    updateField,
    removeField,
    reorderFields,
    
    // Settings Management
    updateSettings,
    updateStyling,
    
    // Bulk Operations
    bulkUpdate,
    bulkDelete,
    bulkPublish,
    bulkUnpublish,
    
    // Utilities
    refresh,
    getForm,
    getFormsByStatus,
    searchForms,
    getPublishedForms,
    getDraftForms,
    
    // Analytics
    getAnalytics,
    getConversionRate,
    getSubmissions,
    getFieldAnalytics,
    
    // Form Validation
    validateForm,
    submitForm,
    
    // Pagination
    pagination: memoizedPagination
  };
};
