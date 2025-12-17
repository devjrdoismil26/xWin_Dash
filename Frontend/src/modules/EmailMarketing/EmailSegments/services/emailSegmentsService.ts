/**
 * Serviço de Segmentação de EmailMarketing
 *
 * @description
 * Serviço para o módulo EmailSegments gerenciando segmentação de público.
 * Gerencia CRUD de segmentos, analytics, preview e operações em massa.
 *
 * @module modules/EmailMarketing/EmailSegments/services/emailSegmentsService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailSegment, SegmentField, SegmentFilters, SegmentResponse, SegmentAnalytics, SegmentAnalyticsResponse, SegmentPreviewResponse } from '../types';

/**
 * Classe EmailSegmentsService
 *
 * @description
 * Classe principal do serviço de segmentação do EmailMarketing.
 * Gerencia CRUD de segmentos, analytics, preview e operações em massa.
 *
 * @class EmailSegmentsService
 */
export class EmailSegmentsService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getSegments(filters?: SegmentFilters): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments', {
        params: filters
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async createSegment(segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments', segmentData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async updateSegment(id: string, segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.put(`/email-segments/${id}`, segmentData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async deleteSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete(`/email-segments/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async duplicateSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/${id}/duplicate`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT ACTIONS =====
  async calculateSegment(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/${id}/calculate`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async previewSegment(criteria: unknown): Promise<SegmentPreviewResponse> {
    try {
      const response = await this.api.post('/email-segments/preview', {
        criteria
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async validateSegment(segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments/validate', segmentData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT FIELDS =====
  async getFields(): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments/fields') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } async getFieldOptions(fieldName: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/fields/${fieldName}/options`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? getErrorMessage(error) : 'Erro desconhecido';
      return {
        success: false,
        error: errorMessage};

    } // ===== ANALYTICS =====
  async getSegmentAnalytics(id: string): Promise<SegmentAnalyticsResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/analytics`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getSegmentMetrics(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/metrics`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getSegmentPerformance(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/performance`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT SUBSCRIBERS =====
  async getSegmentSubscribers(id: string, page: number = 1, limit: number = 50): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/subscribers`, {
        params: { page, limit } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async exportSegmentSubscribers(id: string, format: 'json' | 'csv' | 'xlsx' = 'csv'): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/subscribers/export`, {
        params: { format },
        responseType: 'blob'
      }) as { data: Blob};

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
        data: { message: 'Export completed successfully' } ;

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT BUILDER =====
  async saveSegmentDraft(id: string, draftData: Record<string, any>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/${id}/draft`, draftData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getSegmentDraft(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/draft`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async deleteSegmentDraft(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete(`/email-segments/${id}/draft`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT FILTERS =====
  async getSavedFilters(): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments/filters') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async saveFilter(filterData: unknown): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments/filters', filterData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async deleteFilter(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete(`/email-segments/filters/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== BULK OPERATIONS =====
  async bulkUpdateSegments(segmentIds: string[], updates: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.put('/email-segments/bulk-update', {
        segment_ids: segmentIds,
        updates
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async bulkDeleteSegments(segmentIds: string[]): Promise<SegmentResponse> {
    try {
      const response = await this.api.delete('/email-segments/bulk-delete', {
        data: { segment_ids: segmentIds } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async bulkCalculateSegments(segmentIds: string[]): Promise<SegmentResponse> {
    try {
      const response = await this.api.post('/email-segments/bulk-calculate', {
        segment_ids: segmentIds
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT TEMPLATES =====
  async getSegmentTemplates(): Promise<SegmentResponse> {
    try {
      const response = await this.api.get('/email-segments/templates') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async createSegmentFromTemplate(templateId: string, segmentData: Partial<EmailSegment>): Promise<SegmentResponse> {
    try {
      const response = await this.api.post(`/email-segments/templates/${templateId}/create`, segmentData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } // ===== SEGMENT INSIGHTS =====
  async getSegmentInsights(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/insights`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } async getSegmentRecommendations(id: string): Promise<SegmentResponse> {
    try {
      const response = await this.api.get(`/email-segments/${id}/recommendations`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);

      return {
        success: false,
        error: errorMessage};

    } }

// Instância singleton
export const emailSegmentsService = new EmailSegmentsService();

export default emailSegmentsService;
