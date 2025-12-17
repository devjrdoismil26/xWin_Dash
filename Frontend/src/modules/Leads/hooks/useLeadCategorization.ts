import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/services';
import { getErrorMessage } from '@/utils/errorHelpers';

export interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
  usage_count: number;
  created_at: string;
  updated_at: string; }

export interface Category {
  id: number;
  name: string;
  description?: string;
  color: string;
  parent_id?: number;
  children?: Category[];
  lead_count: number;
  created_at: string;
  updated_at: string; }

export interface TagGroup {
  id: number;
  name: string;
  description?: string;
  color: string;
  tags: Tag[];
  lead_count: number;
  created_at: string;
  updated_at: string; }

export interface LeadTag {
  lead_id: number;
  tag_id: number;
  tag: Tag;
  created_at: string; }

export interface LeadCategory {
  lead_id: number;
  category_id: number;
  category: Category;
  created_at: string; }

export interface CategorizationStats {
  total_tags: number;
  total_categories: number;
  total_tag_groups: number;
  most_used_tags: Array<{ tag: Tag;
  count: number;
}>;
  category_distribution: Array<{ category: Category; count: number }>;
  recent_activity: Array<{
    type: 'tag_added' | 'tag_removed' | 'category_changed';
    lead_id: number;
    lead_name: string;
    tag?: Tag;
    category?: Category;
    created_at: string;
  }>;
}

export const useLeadCategorization = () => {
  const [tags, setTags] = useState<Tag[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<CategorizationStats | null>(null);

  // Tags Management
  const fetchTags = useCallback(async (): Promise<Tag[]> => {
    setLoading(true);

    setError(null);

    try {
      const result = await apiClient.get<{ data: Tag[] }>('/api/v1/categorization/tags');

      setTags(result.data || []);

      return result.data || [];
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error fetching tags:', err);

      return [];
    } finally {
      setLoading(false);

    } , []);

  const createTag = useCallback(async (tagData: Omit<Tag, 'id' | 'usage_count' | 'created_at' | 'updated_at'>): Promise<Tag | null> => {
    try {
      const result = await apiClient.post<{ data: Tag }>('/api/v1/categorization/tags', tagData);

      const newTag = result.data;
      
      setTags(prev => [...prev, newTag]);

      return newTag;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error creating tag:', err);

      return null;
    } , []);

  const updateTag = useCallback(async (id: number, tagData: Partial<Tag>): Promise<Tag | null> => {
    try {
      const result = await apiClient.put<{ data: Tag }>(`/api/v1/categorization/tags/${id}`, tagData);

      const updatedTag = result.data;
      
      setTags(prev => prev.map(tag => tag.id === id ? updatedTag : tag));

      return updatedTag;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error updating tag:', err);

      return null;
    } , []);

  const deleteTag = useCallback(async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/categorization/tags/${id}`);

      setTags(prev => prev.filter(tag => tag.id !== id));

      return true;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error deleting tag:', err);

      return false;
    } , []);

  // Categories Management
  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    setLoading(true);

    setError(null);

    try {
      const result = await apiClient.get<{ data: Category[] }>('/api/v1/categorization/categories');

      setCategories(result.data || []);

      return result.data || [];
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error fetching categories:', err);

      return [];
    } finally {
      setLoading(false);

    } , []);

  const createCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'lead_count' | 'children' | 'created_at' | 'updated_at'>): Promise<Category | null> => {
    try {
      const result = await apiClient.post<{ data: Category }>('/api/v1/categorization/categories', categoryData);

      const newCategory = result.data;
      
      setCategories(prev => [...prev, newCategory]);

      return newCategory;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error creating category:', err);

      return null;
    } , []);

  const updateCategory = useCallback(async (id: number, categoryData: Partial<Category>): Promise<Category | null> => {
    try {
      const result = await apiClient.put<{ data: Category }>(`/api/v1/categorization/categories/${id}`, categoryData);

      const updatedCategory = result.data;
      
      setCategories(prev => prev.map(category => category.id === id ? updatedCategory : category));

      return updatedCategory;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error updating category:', err);

      return null;
    } , []);

  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/categorization/categories/${id}`);

      setCategories(prev => prev.filter(category => category.id !== id));

      return true;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error deleting category:', err);

      return false;
    } , []);

  // Lead-Tag Operations
  const addTagToLead = useCallback(async (leadId: number, tagId: number): Promise<boolean> => {
    try {
      await apiClient.post(`/api/v1/leads/${leadId}/tags`, { tag_id: tagId });

      // Update tag usage count
      setTags(prev => prev.map(tag => 
        tag.id === tagId 
          ? { ...tag, usage_count: tag.usage_count + 1 }
          : tag
      ));

      return true;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error adding tag to lead:', err);

      return false;
    } , []);

  const removeTagFromLead = useCallback(async (leadId: number, tagId: number): Promise<boolean> => {
    try {
      await apiClient.delete(`/api/v1/leads/${leadId}/tags/${tagId}`);

      // Update tag usage count
      setTags(prev => prev.map(tag => 
        tag.id === tagId 
          ? { ...tag, usage_count: Math.max(0, tag.usage_count - 1) }
          : tag
      ));

      return true;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error removing tag from lead:', err);

      return false;
    } , []);

  const setLeadCategory = useCallback(async (leadId: number, categoryId: number): Promise<boolean> => {
    try {
      await apiClient.put(`/api/v1/leads/${leadId}/category`, { category_id: categoryId });

      return true;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error setting lead category:', err);

      return false;
    } , []);

  // Statistics
  const fetchStats = useCallback(async (): Promise<CategorizationStats | null> => {
    try {
      const result = await apiClient.get<{ data: CategorizationStats }>('/api/v1/categorization/stats');

      setStats(result.data);

      return result.data;
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);

      setError(errorMessage);

      console.error('Error fetching categorization stats:', err);

      return null;
    } , []);

  // Helper functions
  const getTagById = useCallback((id: number): Tag | undefined => {
    return tags.find(tag => tag.id === id);

  }, [tags]);

  const getCategoryById = useCallback((id: number): Category | undefined => {
    return categories.find(category => category.id === id);

  }, [categories]);

  const getTagsByColor = useCallback((color: string): Tag[] => {
    return tags.filter(tag => tag.color === color);

  }, [tags]);

  const getMostUsedTags = useCallback((limit: number = 10): Tag[] => {
    return [...tags]
      .sort((a: unknown, b: unknown) => b.usage_count - a.usage_count)
      .slice(0, limit);

  }, [tags]);

  const getUnusedTags = useCallback((): Tag[] => {
    return tags.filter(tag => tag.usage_count === 0);

  }, [tags]);

  const searchTags = useCallback((query: string): Tag[] => {
    const lowerQuery = query.toLowerCase();

    return tags.filter(tag => 
      tag.name.toLowerCase().includes(lowerQuery) ||
      (tag.description && tag.description.toLowerCase().includes(lowerQuery)));

  }, [tags]);

  const searchCategories = useCallback((query: string): Category[] => {
    const lowerQuery = query.toLowerCase();

    return categories.filter(category => 
      category.name.toLowerCase().includes(lowerQuery) ||
      (category.description && category.description.toLowerCase().includes(lowerQuery)));

  }, [categories]);

  // Initial load
  useEffect(() => {
    fetchTags();

    fetchCategories();

    fetchStats();

  }, [fetchTags, fetchCategories, fetchStats]);

  return {
    // State
    tags,
    categories,
    tagGroups,
    loading,
    error,
    stats,
    
    // Tag operations
    fetchTags,
    createTag,
    updateTag,
    deleteTag,
    
    // Category operations
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Lead operations
    addTagToLead,
    removeTagFromLead,
    setLeadCategory,
    
    // Statistics
    fetchStats,
    
    // Helpers
    getTagById,
    getCategoryById,
    getTagsByColor,
    getMostUsedTags,
    getUnusedTags,
    searchTags,
    searchCategories,};
};
