import { useState, useEffect, useCallback } from 'react';

export interface EmailSegment {
  id: number;
  name: string;
  description?: string;
  user_id: number;
  rules: SegmentRule[];
  created_at: string;
  updated_at: string;
  subscribers_count?: number;
  is_dynamic?: boolean;
}

export interface SegmentRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 'greater_than' | 'less_than' | 'is_empty' | 'is_not_empty';
  value: any;
  condition?: 'and' | 'or';
}

export interface CreateSegmentData {
  name: string;
  description?: string;
  rules: SegmentRule[];
  is_dynamic?: boolean;
}

export interface UpdateSegmentData extends Partial<CreateSegmentData> {
  id: number;
}

export interface SegmentFilters {
  search?: string;
  is_dynamic?: boolean;
  page?: number;
  per_page?: number;
}

export const useEmailSegments = () => {
  const [segments, setSegments] = useState<EmailSegment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  // Fetch segments
  const fetchSegments = useCallback(async (filters: SegmentFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.is_dynamic !== undefined) params.append('is_dynamic', filters.is_dynamic.toString());
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.per_page) params.append('per_page', filters.per_page.toString());

      const response = await fetch(`/api/v1/email-marketing/email-segments?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch segments');
      }

      const data = await response.json();
      setSegments(data.data || []);
      setPagination(data.meta || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch segments');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create segment
  const createSegment = useCallback(async (data: CreateSegmentData): Promise<EmailSegment> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/email-marketing/email-segments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create segment');
      }

      const newSegment = await response.json();
      setSegments(prev => [newSegment, ...prev]);
      return newSegment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create segment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update segment
  const updateSegment = useCallback(async (data: UpdateSegmentData): Promise<EmailSegment> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-segments/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update segment');
      }

      const updatedSegment = await response.json();
      setSegments(prev => prev.map(s => s.id === data.id ? updatedSegment : s));
      return updatedSegment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update segment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete segment
  const deleteSegment = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-segments/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete segment');
      }

      setSegments(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete segment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single segment
  const getSegment = useCallback(async (id: number): Promise<EmailSegment> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-segments/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch segment');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch segment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get segment subscribers
  const getSegmentSubscribers = useCallback(async (id: number, page: number = 1, perPage: number = 15): Promise<any> => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('per_page', perPage.toString());

      const response = await fetch(`/api/v1/email-marketing/email-segments/${id}/subscribers?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch segment subscribers');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch segment subscribers');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Test segment rules
  const testSegmentRules = useCallback(async (rules: SegmentRule[]): Promise<{ count: number; sample_subscribers: any[] }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/email-marketing/email-segments/test-rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rules }),
      });

      if (!response.ok) {
        throw new Error('Failed to test segment rules');
      }

      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to test segment rules');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh segment (recalculate subscribers for dynamic segments)
  const refreshSegment = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/v1/email-marketing/email-segments/${id}/refresh`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to refresh segment');
      }

      // Update segment with new subscriber count
      const updatedSegment = await response.json();
      setSegments(prev => prev.map(s => s.id === id ? updatedSegment : s));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh segment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get available segment fields
  const getSegmentFields = useCallback(async (): Promise<{ field: string; type: string; label: string }[]> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1/email-marketing/email-segments/fields');
      
      if (!response.ok) {
        throw new Error('Failed to fetch segment fields');
      }

      const data = await response.json();
      return data.fields || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch segment fields');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

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
    getSegmentFields,
  };
};

export default useEmailSegments;
