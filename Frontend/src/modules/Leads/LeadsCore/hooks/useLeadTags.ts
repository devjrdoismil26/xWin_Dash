import { useState, useCallback } from 'react';
import { Tag } from './useLeadCategorization';

export interface LeadTagAssignment {
  lead_id: number;
  tag_id: number;
  tag: Tag;
  assigned_at: string;
  assigned_by: number;
}

export interface TagFilter {
  tag_ids: number[];
  operator: 'AND' | 'OR';
}

export interface TagSuggestion {
  tag: Tag;
  confidence: number;
  reason: string;
}

export const useLeadTags = () => {
  const [leadTags, setLeadTags] = useState<LeadTagAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get tags for a specific lead
  const getLeadTags = useCallback(async (leadId: number): Promise<Tag[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/leads/${leadId}/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar tags do lead';
      setError(errorMessage);
      console.error('Error fetching lead tags:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Add multiple tags to a lead
  const addTagsToLead = useCallback(async (leadId: number, tagIds: number[]): Promise<boolean> => {
    try {
      const response = await fetch(`/api/v1/leads/${leadId}/tags/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ tag_ids: tagIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar tags ao lead';
      setError(errorMessage);
      console.error('Error adding tags to lead:', err);
      return false;
    }
  }, []);

  // Remove multiple tags from a lead
  const removeTagsFromLead = useCallback(async (leadId: number, tagIds: number[]): Promise<boolean> => {
    try {
      const response = await fetch(`/api/v1/leads/${leadId}/tags/bulk`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify({ tag_ids: tagIds }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover tags do lead';
      setError(errorMessage);
      console.error('Error removing tags from lead:', err);
      return false;
    }
  }, []);

  // Get leads by tag filter
  const getLeadsByTags = useCallback(async (tagFilter: TagFilter): Promise<any[]> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/leads/by-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
        body: JSON.stringify(tagFilter),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar leads por tags';
      setError(errorMessage);
      console.error('Error fetching leads by tags:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get tag suggestions for a lead
  const getTagSuggestions = useCallback(async (leadId: number): Promise<TagSuggestion[]> => {
    try {
      const response = await fetch(`/api/v1/leads/${leadId}/tag-suggestions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter sugestões de tags';
      setError(errorMessage);
      console.error('Error fetching tag suggestions:', err);
      return [];
    }
  }, []);

  // Auto-tag leads based on content
  const autoTagLead = useCallback(async (leadId: number): Promise<Tag[]> => {
    try {
      const response = await fetch(`/api/v1/leads/${leadId}/auto-tag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao aplicar tags automáticas';
      setError(errorMessage);
      console.error('Error auto-tagging lead:', err);
      return [];
    }
  }, []);

  // Get tag analytics
  const getTagAnalytics = useCallback(async (tagId: number): Promise<any> => {
    try {
      const response = await fetch(`/api/v1/categorization/tags/${tagId}/analytics`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao obter analytics da tag';
      setError(errorMessage);
      console.error('Error fetching tag analytics:', err);
      return null;
    }
  }, []);

  // Helper functions
  const getTagColor = useCallback((tag: Tag): string => {
    return tag.color || '#6B7280';
  }, []);

  const getTagTextColor = useCallback((tag: Tag): string => {
    const color = getTagColor(tag);
    // Simple contrast calculation
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }, [getTagColor]);

  const formatTagName = useCallback((tag: Tag): string => {
    return tag.name.charAt(0).toUpperCase() + tag.name.slice(1);
  }, []);

  const getTagUsagePercentage = useCallback((tag: Tag, totalLeads: number): number => {
    if (totalLeads === 0) return 0;
    return Math.round((tag.usage_count / totalLeads) * 100);
  }, []);

  const sortTagsByUsage = useCallback((tags: Tag[]): Tag[] => {
    return [...tags].sort((a, b) => b.usage_count - a.usage_count);
  }, []);

  const sortTagsByName = useCallback((tags: Tag[]): Tag[] => {
    return [...tags].sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const sortTagsByColor = useCallback((tags: Tag[]): Tag[] => {
    return [...tags].sort((a, b) => a.color.localeCompare(b.color));
  }, []);

  const filterTagsByColor = useCallback((tags: Tag[], color: string): Tag[] => {
    return tags.filter(tag => tag.color === color);
  }, []);

  const filterTagsByUsage = useCallback((tags: Tag[], minUsage: number): Tag[] => {
    return tags.filter(tag => tag.usage_count >= minUsage);
  }, []);

  const searchTagsByName = useCallback((tags: Tag[], query: string): Tag[] => {
    const lowerQuery = query.toLowerCase();
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery) ||
      (tag.description && tag.description.toLowerCase().includes(lowerQuery))
    );
  }, []);

  const getPopularTags = useCallback((tags: Tag[], limit: number = 10): Tag[] => {
    return sortTagsByUsage(tags).slice(0, limit);
  }, [sortTagsByUsage]);

  const getUnusedTags = useCallback((tags: Tag[]): Tag[] => {
    return tags.filter(tag => tag.usage_count === 0);
  }, []);

  const getRecentlyUsedTags = useCallback((tags: Tag[], limit: number = 10): Tag[] => {
    // This would need to be implemented in the backend
    // For now, return most used tags
    return sortTagsByUsage(tags).slice(0, limit);
  }, [sortTagsByUsage]);

  return {
    // State
    leadTags,
    loading,
    error,
    
    // Operations
    getLeadTags,
    addTagsToLead,
    removeTagsFromLead,
    getLeadsByTags,
    getTagSuggestions,
    autoTagLead,
    getTagAnalytics,
    
    // Helpers
    getTagColor,
    getTagTextColor,
    formatTagName,
    getTagUsagePercentage,
    sortTagsByUsage,
    sortTagsByName,
    sortTagsByColor,
    filterTagsByColor,
    filterTagsByUsage,
    searchTagsByName,
    getPopularTags,
    getUnusedTags,
    getRecentlyUsedTags,
  };
};
