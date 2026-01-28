/**
 * Service para o módulo EmailTemplates
 * Gerencia templates de email
 */

import { apiClient } from '@/services';
import { 
  EmailTemplate, 
  TemplateCategory,
  TemplateFilters, 
  TemplateResponse,
  TemplateCategoryResponse,
  TemplateUsage,
  TemplateUsageResponse 
} from '../types';

export class EmailTemplatesService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      const response = await this.api.get('/email-templates', {
        params: filters
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createTemplate(templateData: Partial<EmailTemplate>): Promise<TemplateResponse> {
    try {
      const response = await this.api.post('/email-templates', templateData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateTemplate(id: string, templateData: Partial<EmailTemplate>): Promise<TemplateResponse> {
    try {
      const response = await this.api.put(`/email-templates/${id}`, templateData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.delete(`/email-templates/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async duplicateTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/duplicate`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TEMPLATE ACTIONS =====
  async publishTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/publish`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async unpublishTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/unpublish`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async previewTemplate(id: string, previewData?: Record<string, any>): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/preview`, {
        preview_data: previewData
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async validateTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/validate`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== CATEGORIES =====
  async getCategories(): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.get('/email-templates/categories');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async createCategory(categoryData: Partial<TemplateCategory>): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.post('/email-templates/categories', categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async updateCategory(id: string, categoryData: Partial<TemplateCategory>): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.put(`/email-templates/categories/${id}`, categoryData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteCategory(id: string): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.delete(`/email-templates/categories/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TEMPLATE USAGE =====
  async getTemplateUsage(id: string): Promise<TemplateUsageResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/usage`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTemplateStats(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TEMPLATE BUILDER =====
  async saveTemplateDraft(id: string, draftData: any): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/draft`, draftData);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTemplateDraft(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/draft`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteTemplateDraft(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.delete(`/email-templates/${id}/draft`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TEMPLATE IMPORT/EXPORT =====
  async importTemplate(file: File): Promise<TemplateResponse> {
    try {
      const formData = new FormData();
      formData.append('template_file', file);
      
      const response = await this.api.post('/email-templates/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async exportTemplate(id: string, format: 'html' | 'json' = 'html'): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Criar download do arquivo
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `template-${id}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return {
        success: true,
        data: { message: 'Export completed successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== BULK OPERATIONS =====
  async bulkUpdateTemplates(templateIds: string[], updates: Partial<EmailTemplate>): Promise<TemplateResponse> {
    try {
      const response = await this.api.put('/email-templates/bulk-update', {
        template_ids: templateIds,
        updates
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkDeleteTemplates(templateIds: string[]): Promise<TemplateResponse> {
    try {
      const response = await this.api.delete('/email-templates/bulk-delete', {
        data: { template_ids: templateIds }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async bulkPublishTemplates(templateIds: string[]): Promise<TemplateResponse> {
    try {
      const response = await this.api.post('/email-templates/bulk-publish', {
        template_ids: templateIds
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ===== TEMPLATE LIBRARY =====
  async getPublicTemplates(): Promise<TemplateResponse> {
    try {
      const response = await this.api.get('/email-templates/public');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getTemplateLibrary(): Promise<TemplateResponse> {
    try {
      const response = await this.api.get('/email-templates/library');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async downloadFromLibrary(templateId: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/library/${templateId}/download`);
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Instância singleton
export const emailTemplatesService = new EmailTemplatesService();
export default emailTemplatesService;
