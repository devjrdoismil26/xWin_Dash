import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';

export interface EmailSegment {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  rules: SegmentRule[];
  created_at: string;
  updated_at: string;
  subscribers_count?: number;
  is_dynamic?: boolean; }

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: string | number | boolean | Record<string, any> | unknown[];
  condition?: 'and' | 'or'; }

export interface CreateSegmentData {
  name: string;
  description?: string;
  rules: SegmentRule[];
  is_dynamic?: boolean;
  [key: string]: unknown; }

export interface UpdateSegmentData extends Partial<CreateSegmentData> {
  id: number;
}

export interface SegmentFilters {
  search?: string;
  is_dynamic?: boolean;
  page?: number;
  per_page?: number; }

export const useEmailSegments = () => {
  const [segments, setSegments] = useState<EmailSegment[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<Record<string, any>>(null);

  // Fetch segments
  const fetchSegments = useCallback(async (filters: SegmentFilters = {}) => {
    try {
      setLoading(true);

      setError(null);

      const params: Record<string, string> = {};

      if (filters.search) params.search = filters.search;
      if (filters.is_dynamic !== undefined) params.is_dynamic = filters.is_dynamic.toString();

      if (filters.page) params.page = filters.page.toString();

      if (filters.per_page) params.per_page = filters.per_page.toString();

      const data = await apiClient.get<{ data: EmailSegment[]; meta: unknown }>('/api/v1/email-marketing/email-segments', { params });

      setSegments(data.data || []);

      setPagination(data.meta || null);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

    } finally {
      setLoading(false);

    } , []);

  // Create segment
  const createSegment = useCallback(async (data: CreateSegmentData): Promise<EmailSegment> => {
    try {
      setLoading(true);

      setError(null);

      const newSegment = await apiClient.post<EmailSegment>('/api/v1/email-marketing/email-segments', data);

      setSegments(prev => [newSegment, ...prev]);

      return newSegment;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Update segment
  const updateSegment = useCallback(async (data: UpdateSegmentData): Promise<EmailSegment> => {
    try {
      setLoading(true);

      setError(null);

      const updatedSegment = await apiClient.put<EmailSegment>(`/api/v1/email-marketing/email-segments/${data.id}`, data);

      setSegments(prev => prev.map(s => s.id === (data as any).id ? updatedSegment : s));

      return updatedSegment;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Delete segment
  const deleteSegment = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      await apiClient.delete(`/api/v1/email-marketing/email-segments/${id}`);

      setSegments(prev => prev.filter(s => s.id !== id));

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get single segment
  const getSegment = useCallback(async (id: number): Promise<EmailSegment> => {
    try {
      setLoading(true);

      setError(null);

      return await apiClient.get<EmailSegment>(`/api/v1/email-marketing/email-segments/${id}`);

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get segment subscribers
  const getSegmentSubscribers = useCallback(async (id: number, page: number = 1, perPage: number = 15): Promise<Record<string, any>> => {
    try {
      setLoading(true);

      setError(null);

      return await apiClient.get(`/api/v1/email-marketing/email-segments/${id}/subscribers`, {
        params: { page: page.toString(), per_page: perPage.toString() } );

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Test segment rules
  const testSegmentRules = useCallback(async (rules: SegmentRule[]): Promise<{ count: number; sample_subscribers: string[] }> => {
    try {
      setLoading(true);

      setError(null);

      return await apiClient.post<{ count: number; sample_subscribers: string[] }>('/api/v1/email-marketing/email-segments/test-rules', { rules });

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Refresh segment (recalculate subscribers for dynamic segments)
  const refreshSegment = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);

      setError(null);

      // Update segment with new subscriber count
      const updatedSegment = await apiClient.post<EmailSegment>(`/api/v1/email-marketing/email-segments/${id}/refresh`);

      setSegments(prev => prev.map(s => s.id === id ? updatedSegment : s));

    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  // Get available segment fields
  const getSegmentFields = useCallback(async (): Promise<{ field: string; type: string; label: string }[]> => {
    try {
      setLoading(true);

      setError(null);

      const data = await apiClient.get<{ fields: { field: string; type: string; label: string }[] }>('/api/v1/email-marketing/email-segments/fields');

      return (data as any).fields || [];
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      throw err;
    } finally {
      setLoading(false);

    } , []);

  return {
    segments,
    loading,
    error,
    pagination,
    fetchSegments,
    createSegment,
    updateSegment,
    deleteSegment,
    getSegment,
    getSegmentSubscribers,
    testSegmentRules,
    refreshSegment,
    getSegmentFields,};
};

export default useEmailSegments;
