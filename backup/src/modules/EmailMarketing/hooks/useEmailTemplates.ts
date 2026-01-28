import { useState, useEffect, useCallback } from 'react';

export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  category?: string;
  tags?: string[];
  variables?: string[];
  preview_url?: string;
}

export interface CreateTemplateData {
  name: string;
  subject: string;
  body: string;
  category?: string;
  tags?: string[];
  variables?: string[];
}

export interface UpdateTemplateData extends Partial<CreateTemplateData> {
  id: number;
}

export interface TemplateFilters {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch templates
  const fetchTemplates = useCallback(async (filters: TemplateFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`/api/v1/email-marketing/email-templates?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      const data = await response.json();
      setTemplates(data.data || []);
      setPagination(data.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create template
  const createTemplate = useCallback(async (data: CreateTemplateData): Promise<EmailTemplate> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/email-marketing/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      const newTemplate = await response.json();
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update template
  const updateTemplate = useCallback(async (data: UpdateTemplateData): Promise<EmailTemplate> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-templates/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update template');
      }

      const updatedTemplate = await response.json();
      setTemplates(prev => prev.map(t => t.id === data.id ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete template
  const deleteTemplate = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-templates/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      setTemplates(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single template
  const getTemplate = useCallback(async (id: number): Promise<EmailTemplate> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-templates/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Duplicate template
  const duplicateTemplate = useCallback(async (id: number, newName: string): Promise<EmailTemplate> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-templates/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error('Failed to duplicate template');
      }

      const duplicatedTemplate = await response.json();
      setTemplates(prev => [duplicatedTemplate, ...prev]);
      return duplicatedTemplate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Preview template
  const previewTemplate = useCallback(async (id: number, variables?: Record<string, any>): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-templates/${id}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variables }),
      });

      if (!response.ok) {
        throw new Error('Failed to preview template');
      }

      const data = await response.json();
      return data.html;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to preview template');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get template categories
  const getTemplateCategories = useCallback(async (): Promise<string[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/email-marketing/email-templates/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch template categories');
      }

      const data = await response.json();
      return data.categories || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch template categories');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    templates,
    loading,
    error,
    pagination,
    fetchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplate,
    duplicateTemplate,
    previewTemplate,
    getTemplateCategories,
  };
};

export default useEmailTemplates;
