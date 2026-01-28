/**
 * Hook para o módulo EmailTemplates
 * Gerencia templates de email
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  EmailTemplate, 
  TemplateCategory,
  TemplateFilters, 
  TemplateResponse,
  TemplateCategoryResponse,
  TemplateUsage,
  UseEmailTemplatesReturn 
} from '../types';

export const useEmailTemplates = (): UseEmailTemplatesReturn => {
  // Estado principal
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [categories, setCategories] = useState<TemplateCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para buscar templates
  const fetchTemplates = useCallback(async (filters?: TemplateFilters) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              value.forEach(v => queryParams.append(`${key}[]`, String(v)));
            } else {
              queryParams.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`/api/v1/email-templates?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setTemplates(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        throw new Error(result.error || 'Failed to fetch templates');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar categorias
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/v1/email-templates/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setCategories(Array.isArray(result.data) ? result.data : [result.data]);
      } else {
        throw new Error(result.error || 'Failed to fetch categories');
      }
    } catch (err: any) {
      console.error('Error fetching template categories:', err);
    }
  }, []);

  // Função para criar template
  const createTemplate = useCallback(async (templateData: Partial<EmailTemplate>): Promise<TemplateResponse> => {
    try {
      const response = await fetch('/api/v1/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchTemplates();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error creating template:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchTemplates]);

  // Função para atualizar template
  const updateTemplate = useCallback(async (id: string, templateData: Partial<EmailTemplate>): Promise<TemplateResponse> => {
    try {
      const response = await fetch(`/api/v1/email-templates/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchTemplates();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error updating template:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchTemplates]);

  // Função para deletar template
  const deleteTemplate = useCallback(async (id: string): Promise<TemplateResponse> => {
    try {
      const response = await fetch(`/api/v1/email-templates/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchTemplates();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error deleting template:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchTemplates]);

  // Função para duplicar template
  const duplicateTemplate = useCallback(async (id: string): Promise<TemplateResponse> => {
    try {
      const response = await fetch(`/api/v1/email-templates/${id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchTemplates();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error duplicating template:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchTemplates]);

  // Função para publicar template
  const publishTemplate = useCallback(async (id: string): Promise<TemplateResponse> => {
    try {
      const response = await fetch(`/api/v1/email-templates/${id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchTemplates();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error publishing template:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchTemplates]);

  // Função para despublicar template
  const unpublishTemplate = useCallback(async (id: string): Promise<TemplateResponse> => {
    try {
      const response = await fetch(`/api/v1/email-templates/${id}/unpublish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        await fetchTemplates();
      }
      
      return result;
    } catch (err: any) {
      console.error('Error unpublishing template:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, [fetchTemplates]);

  // Função para obter uso do template
  const getTemplateUsage = useCallback(async (id: string): Promise<TemplateUsage[]> => {
    try {
      const response = await fetch(`/api/v1/email-templates/${id}/usage`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch template usage');
      }
    } catch (err: any) {
      console.error('Error fetching template usage:', err);
      throw err;
    }
  }, []);

  // Função para obter template por ID
  const getTemplateById = useCallback((id: string): EmailTemplate | undefined => {
    return templates.find(template => template.id === id);
  }, [templates]);

  // Função para obter templates por categoria
  const getTemplatesByCategory = useCallback((category: string): EmailTemplate[] => {
    return templates.filter(template => template.category === category);
  }, [templates]);

  // Função para obter templates públicos
  const getPublicTemplates = useCallback((): EmailTemplate[] => {
    return templates.filter(template => template.is_public);
  }, [templates]);

  // Função para formatar métricas do template
  const formatTemplateMetrics = useCallback((template: EmailTemplate) => {
    return {
      usage_count: new Intl.NumberFormat('pt-BR').format(template.usage_count),
      created_at: new Date(template.created_at).toLocaleDateString('pt-BR'),
      updated_at: new Date(template.updated_at).toLocaleDateString('pt-BR'),
      is_active: template.is_active ? 'Ativo' : 'Inativo',
      is_public: template.is_public ? 'Público' : 'Privado',
      version: `v${template.version}`
    };
  }, []);

  // Função para validar template
  const validateTemplate = useCallback((template: EmailTemplate): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!template.name || template.name.trim().length === 0) {
      errors.push('Nome do template é obrigatório');
    }

    if (!template.subject || template.subject.trim().length === 0) {
      errors.push('Assunto do template é obrigatório');
    }

    if (!template.content || !template.content.html || template.content.html.trim().length === 0) {
      errors.push('Conteúdo HTML do template é obrigatório');
    }

    if (!template.category || template.category.trim().length === 0) {
      errors.push('Categoria do template é obrigatória');
    }

    if (template.variables && template.variables.length > 0) {
      template.variables.forEach((variable, index) => {
        if (!variable.name || variable.name.trim().length === 0) {
          errors.push(`Variável ${index + 1}: nome é obrigatório`);
        }
        if (variable.required && !variable.default_value) {
          errors.push(`Variável ${variable.name}: valor padrão é obrigatório para variáveis obrigatórias`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    fetchTemplates();
    fetchCategories();
  }, [fetchTemplates, fetchCategories]);

  return {
    templates,
    categories,
    loading,
    error,
    fetchTemplates,
    fetchCategories,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    publishTemplate,
    unpublishTemplate,
    getTemplateUsage,
    getTemplateById,
    getTemplatesByCategory,
    getPublicTemplates,
    formatTemplateMetrics,
    validateTemplate
  };
};
