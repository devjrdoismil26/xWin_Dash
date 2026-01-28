/**
 * Service para o módulo EmailSegments
 * Gerencia segmentação de público
 */

import { apiClient } from '@/services';
import { 
  EmailSegment, 
  SegmentField,
  SegmentFilters, 
  SegmentResponse,
  SegmentAnalytics,
  SegmentAnalyticsResponse,
  SegmentPreviewResponse 
} from '../types';

export class EmailSegmentsService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getSegments(filters?: SegmentFilters): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments', {
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

  async getSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}`);
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

  async createSegment(segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments', segmentData);
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

  async updateSegment(id: string, segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.put(`/email-segments/${id}`, segmentData);
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

  async deleteSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete(`/email-segments/${id}`);
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

  async duplicateSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/${id}/duplicate`);
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

  // ===== SEGMENT ACTIONS =====
  async calculateSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/${id}/calculate`);
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

  async previewSegment(criteria: any): Promise<SegmentPreviewResponse> {
    try {
      const response = await this.api.post('/email-segments/preview', {
        criteria
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

  async validateSegment(segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments/validate', segmentData);
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

  // ===== SEGMENT FIELDS =====
  async getFields(): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments/fields');
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

  async getFieldOptions(fieldName: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/fields/${fieldName}/options`);
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

  // ===== ANALYTICS =====
  async getSegmentAnalytics(id: string): Promise<SegmentAnalyticsResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/analytics`);
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

  async getSegmentMetrics(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/metrics`);
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

  async getSegmentPerformance(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/performance`);
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

  // ===== SEGMENT SUBSCRIBERS =====
  async getSegmentSubscribers(id: string, page: number = 1, limit: number = 50): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/subscribers`, {
        params: { page, limit }
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

  async exportSegmentSubscribers(id: string, format: 'json' | 'csv' | 'xlsx' = 'csv'): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/subscribers/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      // Criar download do arquivo
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `segment-${id}-subscribers-${new Date().toISOString().split('T')[0]}.${format}`;
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

  // ===== SEGMENT BUILDER =====
  async saveSegmentDraft(id: string, draftData: any): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/${id}/draft`, draftData);
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

  async getSegmentDraft(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/draft`);
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

  async deleteSegmentDraft(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete(`/email-segments/${id}/draft`);
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

  // ===== SEGMENT FILTERS =====
  async getSavedFilters(): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments/filters');
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

  async saveFilter(filterData: any): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments/filters', filterData);
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

  async deleteFilter(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete(`/email-segments/filters/${id}`);
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

  // ===== BULK OPERATIONS =====
  async bulkUpdateSegments(segmentIds: string[], updates: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.put('/email-segments/bulk-update', {
        segment_ids: segmentIds,
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

  async bulkDeleteSegments(segmentIds: string[]): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete('/email-segments/bulk-delete', {
        data: { segment_ids: segmentIds }
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

  async bulkCalculateSegments(segmentIds: string[]): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments/bulk-calculate', {
        segment_ids: segmentIds
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

  // ===== SEGMENT TEMPLATES =====
  async getSegmentTemplates(): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments/templates');
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

  async createSegmentFromTemplate(templateId: string, segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/templates/${templateId}/create`, segmentData);
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

  // ===== SEGMENT INSIGHTS =====
  async getSegmentInsights(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/insights`);
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

  async getSegmentRecommendations(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/recommendations`);
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
export const emailSegmentsService = new EmailSegmentsService();
export default emailSegmentsService;
