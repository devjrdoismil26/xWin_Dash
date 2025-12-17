/**
 * Serviço de Templates de EmailMarketing
 *
 * @description
 * Serviço para o módulo EmailTemplates gerenciando templates de email.
 * Gerencia CRUD de templates, categorias, uso e operações em massa.
 *
 * @module modules/EmailMarketing/EmailTemplates/services/emailTemplatesService
 * @since 1.0.0
 */

import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';
import { EmailTemplate, TemplateCategory, TemplateFilters, TemplateResponse, TemplateCategoryResponse, TemplateUsage, TemplateUsageResponse } from '../types';

export class EmailTemplatesService {
  private api = apiClient;

  // ===== CRUD OPERATIONS =====
  async getTemplates(filters?: TemplateFilters): Promise<TemplateResponse> {
    try {
      const response = await this.api.get('/email-templates', {
        params: filters
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async createTemplate(templateData: Partial<EmailTemplate>): Promise<TemplateResponse> {
    try {
      const response = await this.api.post('/email-templates', templateData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async updateTemplate(id: string, templateData: Partial<EmailTemplate>): Promise<TemplateResponse> {
    try {
      const response = await this.api.put(`/email-templates/${id}`, templateData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async deleteTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.delete(`/email-templates/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async duplicateTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/duplicate`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== TEMPLATE ACTIONS =====
  async publishTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/publish`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async unpublishTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/unpublish`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async previewTemplate(id: string, previewData?: Record<string, any>): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/preview`, {
        preview_data: previewData
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async validateTemplate(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/validate`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== CATEGORIES =====
  async getCategories(): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.get('/email-templates/categories') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async createCategory(categoryData: Partial<TemplateCategory>): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.post('/email-templates/categories', categoryData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async updateCategory(id: string, categoryData: Partial<TemplateCategory>): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.put(`/email-templates/categories/${id}`, categoryData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async deleteCategory(id: string): Promise<TemplateCategoryResponse> {
    try {
      const response = await this.api.delete(`/email-templates/categories/${id}`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== TEMPLATE USAGE =====
  async getTemplateUsage(id: string): Promise<TemplateUsageResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/usage`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getTemplateStats(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/stats`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== TEMPLATE BUILDER =====
  async saveTemplateDraft(id: string, draftData: Record<string, any>): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/${id}/draft`, draftData) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getTemplateDraft(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/draft`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async deleteTemplateDraft(id: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.delete(`/email-templates/${id}/draft`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== TEMPLATE IMPORT/EXPORT =====
  async importTemplate(file: File): Promise<TemplateResponse> {
    try {
      const formData = new FormData();

      formData.append('template_file', file);

      const response = await this.api.post('/email-templates/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async exportTemplate(id: string, format: 'html' | 'json' = 'html'): Promise<TemplateResponse> {
    try {
      const response = await this.api.get(`/email-templates/${id}/export`, {
        params: { format },
        responseType: 'blob'
      }) as { data: Blob};

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
        data: { message: 'Export completed successfully' } ;

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== BULK OPERATIONS =====
  async bulkUpdateTemplates(templateIds: string[], updates: Partial<EmailTemplate>): Promise<TemplateResponse> {
    try {
      const response = await this.api.put('/email-templates/bulk-update', {
        template_ids: templateIds,
        updates
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async bulkDeleteTemplates(templateIds: string[]): Promise<TemplateResponse> {
    try {
      const response = await this.api.delete('/email-templates/bulk-delete', {
        data: { template_ids: templateIds } ) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async bulkPublishTemplates(templateIds: string[]): Promise<TemplateResponse> {
    try {
      const response = await this.api.post('/email-templates/bulk-publish', {
        template_ids: templateIds
      }) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } // ===== TEMPLATE LIBRARY =====
  async getPublicTemplates(): Promise<TemplateResponse> {
    try {
      const response = await this.api.get('/email-templates/public') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async getTemplateLibrary(): Promise<TemplateResponse> {
    try {
      const response = await this.api.get('/email-templates/library') as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } async downloadFromLibrary(templateId: string): Promise<TemplateResponse> {
    try {
      const response = await this.api.post(`/email-templates/library/${templateId}/download`) as { data?: string};

      return {
        success: true,
        data: (response as any).data};

    } catch (error: unknown) {
      return {
        success: false,
        error: getErrorMessage(error)};

    } }

// Instância singleton
export const emailTemplatesService = new EmailTemplatesService();

export default emailTemplatesService;
