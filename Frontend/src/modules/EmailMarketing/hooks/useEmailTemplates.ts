import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';

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
  preview_url?: string; }

export interface CreateTemplateData {
  name: string;
  subject: string;
  body: string;
  category?: string;
  tags?: string[];
  variables?: string[];
  [key: string]: unknown; }

export interface UpdateTemplateData extends Partial<CreateTemplateData> {
  id: number;
}

export interface TemplateFilters {
  category?: string;
  search?: string;
  page?: number;
  per_page?: number; }

export const useEmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<Record<string, any>>(null);

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

      const data = await apiClient.get<{ data: EmailTemplate[]; meta: Record<string, any> }>(`/api/v1/email-marketing/email-templates`, { params: Object.fromEntries(params) });

      setTemplates(data.data || []);

      setPagination(data.meta || null);

    } catch (err: unknown) {
      setError(getErrorMessage(err));

    } finally {
      setLoading(false);

    } , []);

  // Create template
  const createTemplate = useCallback(async (data: CreateTemplateData): Promise<EmailTemplate> => {
    try {
      setLoading(true);

      setError(null);

      const newTemplate = await apiClient.post<EmailTemplate>('/api/v1/email-marketing/email-templates', data);

      setTemplates(prev => [newTemplate, ...prev]);

      return newTemplate;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Update template
  const updateTemplate = useCallback(async (data: UpdateTemplateData): Promise<EmailTemplate> => {
    try {
      setLoading(true);

      setError(null);

      const updatedTemplate = await apiClient.put<EmailTemplate>(`/api/v1/email-marketing/email-templates/${data.id}`, data);

      setTemplates(prev => prev.map(t => t.id === (data as any).id ? updatedTemplate : t));

      return updatedTemplate;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Delete template
  const deleteTemplate = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.delete(`/api/v1/email-marketing/email-templates/${id}`);

      setTemplates(prev => prev.filter(t => t.id !== id));

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Get single template
  const getTemplate = useCallback(async (id: number): Promise<EmailTemplate> => {
    try {
      setLoading(true);

      setError(null);

      const template = await apiClient.get<EmailTemplate>(`/api/v1/email-marketing/email-templates/${id}`);

      return template;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Duplicate template
  const duplicateTemplate = useCallback(async (id: number, newName: string): Promise<EmailTemplate> => {
    try {
      setLoading(true);

      setError(null);

      const duplicatedTemplate = await apiClient.post<EmailTemplate>(`/api/v1/email-marketing/email-templates/${id}/duplicate`, { name: newName });

      setTemplates(prev => [duplicatedTemplate, ...prev]);

      return duplicatedTemplate;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Eye template
  const previewTemplate = useCallback(async (id: number, variables?: Record<string, any>): Promise<string> => {
    try {
      setLoading(true);

      setError(null);

      const data = await apiClient.post<{ html: string }>(`/api/v1/email-marketing/email-templates/${id}/preview`, { variables });

      return (data as any).html;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Get template categories
  const getTemplateCategories = useCallback(async (): Promise<string[]> => {
    try {
      setLoading(true);

      setError(null);

      const data = await apiClient.get<{ categories: string[] }>('/api/v1/email-marketing/email-templates/categories');

      return (data as any).categories || [];
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw new Error(errorMessage);

    } finally {
      setLoading(false);

    } , []);

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
    getTemplateCategories,};
};

export default useEmailTemplates;
