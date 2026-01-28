// ========================================
// PRODUCTS MODULE - LANDING PAGES HOOK
// ========================================

import { useState, useEffect, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import { 
  LandingPage, 
  LandingPagesResponse, 
  LandingPagesFilter, 
  CreateLandingPageData, 
  UpdateLandingPageData,
  LandingPageStatus,
  SectionType,
  LandingPageContent,
  LandingPageDesign,
  LandingPageSEO
} from '../types/products';

interface UseLandingPagesOptions {
  initialFilters?: LandingPagesFilter;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseLandingPagesReturn {
  // Data
  landingPages: LandingPage[];
  loading: boolean;
  error: string | null;
  
  // Filters & Search
  filters: LandingPagesFilter;
  setFilters: (filters: LandingPagesFilter) => void;
  updateFilter: (key: keyof LandingPagesFilter, value: any) => void;
  clearFilters: () => void;
  
  // CRUD Operations
  createLandingPage: (data: CreateLandingPageData) => Promise<LandingPage>;
  updateLandingPage: (id: string, data: UpdateLandingPageData) => Promise<LandingPage>;
  deleteLandingPage: (id: string) => Promise<void>;
  duplicateLandingPage: (id: string) => Promise<LandingPage>;
  publishLandingPage: (id: string) => Promise<LandingPage>;
  unpublishLandingPage: (id: string) => Promise<LandingPage>;
  
  // Content Management
  updateContent: (id: string, content: LandingPageContent) => Promise<LandingPage>;
  updateDesign: (id: string, design: LandingPageDesign) => Promise<LandingPage>;
  updateSEO: (id: string, seo: LandingPageSEO) => Promise<LandingPage>;
  addSection: (id: string, section: any) => Promise<LandingPage>;
  updateSection: (id: string, sectionId: string, section: any) => Promise<LandingPage>;
  removeSection: (id: string, sectionId: string) => Promise<LandingPage>;
  reorderSections: (id: string, sectionIds: string[]) => Promise<LandingPage>;
  
  // Bulk Operations
  bulkUpdate: (ids: string[], updates: Partial<UpdateLandingPageData>) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkPublish: (ids: string[]) => Promise<void>;
  bulkUnpublish: (ids: string[]) => Promise<void>;
  
  // Utilities
  refresh: () => Promise<void>;
  getLandingPage: (id: string) => LandingPage | undefined;
  getLandingPagesByStatus: (status: LandingPageStatus) => LandingPage[];
  getLandingPagesByProduct: (productId: string) => LandingPage[];
  searchLandingPages: (query: string) => LandingPage[];
  getPublishedLandingPages: () => LandingPage[];
  getDraftLandingPages: () => LandingPage[];
  
  // Analytics
  getAnalytics: (id: string) => Promise<any>;
  getConversionRate: (id: string) => Promise<number>;
  getTrafficData: (id: string, timeRange: string) => Promise<any>;
  
  // Pagination
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    goToPage: (page: number) => void;
    nextPage: () => void;
    prevPage: () => void;
  };
}

export const useLandingPages = (options: UseLandingPagesOptions = {}): UseLandingPagesReturn => {
  const { initialFilters = {}, autoRefresh = false, refreshInterval = 30000 } = options;
  
  // Using router directly for API calls
  
  // State
  const [landingPages, setLandingPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LandingPagesFilter>(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Fetch landing pages
  const fetchLandingPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/landing-pages?' + new URLSearchParams({
        ...filters,
        page: pagination.currentPage.toString(),
        per_page: pagination.perPage.toString()
      }));
      const data = await response.json() as LandingPagesResponse;
      
      if (data) {
        setLandingPages(data.data);
        setPagination(prev => ({
          ...prev,
          currentPage: data.meta.currentPage,
          lastPage: data.meta.lastPage,
          total: data.meta.total,
          hasNextPage: data.meta.currentPage < data.meta.lastPage,
          hasPrevPage: data.meta.currentPage > 1
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch landing pages');
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  // Initial load
  useEffect(() => {
    fetchLandingPages();
  }, [fetchLandingPages]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchLandingPages();
    }, refreshInterval);
    
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchLandingPages]);

  // Filter handlers
  const updateFilter = useCallback((key: keyof LandingPagesFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, []);

  // CRUD operations
  const createLandingPage = useCallback(async (data: CreateLandingPageData): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch('/api/landing-pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const newLandingPage = await response.json() as LandingPage;
      
      if (newLandingPage) {
        setLandingPages(prev => [newLandingPage, ...prev]);
        return newLandingPage;
      }
      
      throw new Error('Failed to create landing page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLandingPage = useCallback(async (id: string, data: UpdateLandingPageData): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to update landing page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const deleteLandingPage = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await fetch(`/api/landing-pages/${id}`, { method: 'DELETE' });
      
      setLandingPages(prev => prev.filter(lp => lp.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateLandingPage = useCallback(async (id: string): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/duplicate`, { method: 'POST' });
      const duplicatedLandingPage = await response.json() as LandingPage;
      
      if (duplicatedLandingPage) {
        setLandingPages(prev => [duplicatedLandingPage, ...prev]);
        return duplicatedLandingPage;
      }
      
      throw new Error('Failed to duplicate landing page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const publishLandingPage = useCallback(async (id: string): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/publish`, { method: 'POST' });
      const publishedLandingPage = await response.json() as LandingPage;
      
      if (publishedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? publishedLandingPage : lp));
        return publishedLandingPage;
      }
      
      throw new Error('Failed to publish landing page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const unpublishLandingPage = useCallback(async (id: string): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/unpublish`, { method: 'POST' });
      const unpublishedLandingPage = await response.json() as LandingPage;
      
      if (unpublishedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? unpublishedLandingPage : lp));
        return unpublishedLandingPage;
      }
      
      throw new Error('Failed to unpublish landing page');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to unpublish landing page');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Content management
  const updateContent = useCallback(async (id: string, content: LandingPageContent): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to update content');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update content');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const updateDesign = useCallback(async (id: string, design: LandingPageDesign): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/design`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ design })
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to update design');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update design');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const updateSEO = useCallback(async (id: string, seo: LandingPageSEO): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/seo`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seo })
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to update SEO');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update SEO');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const addSection = useCallback(async (id: string, section: any): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section })
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to add section');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add section');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSection = useCallback(async (id: string, sectionId: string, section: any): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section })
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to update section');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update section');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  const removeSection = useCallback(async (id: string, sectionId: string): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await del(`/api/landing-pages/${id}/sections/${sectionId}`);
      
      if (response.data) {
        const updatedLandingPage = response.data as LandingPage;
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to remove section');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove section');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reorderSections = useCallback(async (id: string, sectionIds: string[]): Promise<LandingPage> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing-pages/${id}/sections/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionIds })
      });
      const updatedLandingPage = await response.json() as LandingPage;
      
      if (updatedLandingPage) {
        setLandingPages(prev => prev.map(lp => lp.id === id ? updatedLandingPage : lp));
        return updatedLandingPage;
      }
      
      throw new Error('Failed to reorder sections');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reorder sections');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [put]);

  // Bulk operations
  const bulkUpdate = useCallback(async (ids: string[], updates: Partial<UpdateLandingPageData>): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/landing-pages/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, updates })
      });
      
      setLandingPages(prev => prev.map(lp => 
        ids.includes(lp.id) ? { ...lp, ...updates } : lp
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk update landing pages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkDelete = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/landing-pages/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      setLandingPages(prev => prev.filter(lp => !ids.includes(lp.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk delete landing pages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkPublish = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/landing-pages/bulk-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      setLandingPages(prev => prev.map(lp => 
        ids.includes(lp.id) ? { ...lp, status: LandingPageStatus.PUBLISHED } : lp
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk publish landing pages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const bulkUnpublish = useCallback(async (ids: string[]): Promise<void> => {
    try {
      setLoading(true);
      await fetch('/api/landing-pages/bulk-unpublish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids })
      });
      
      setLandingPages(prev => prev.map(lp => 
        ids.includes(lp.id) ? { ...lp, status: LandingPageStatus.DRAFT } : lp
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to bulk unpublish landing pages');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Utilities
  const refresh = useCallback(async () => {
    await fetchLandingPages();
  }, [fetchLandingPages]);

  const getLandingPage = useCallback((id: string): LandingPage | undefined => {
    return landingPages.find(lp => lp.id === id);
  }, [landingPages]);

  const getLandingPagesByStatus = useCallback((status: LandingPageStatus): LandingPage[] => {
    return landingPages.filter(lp => lp.status === status);
  }, [landingPages]);

  const getLandingPagesByProduct = useCallback((productId: string): LandingPage[] => {
    return landingPages.filter(lp => lp.productId === productId);
  }, [landingPages]);

  const searchLandingPages = useCallback((query: string): LandingPage[] => {
    if (!query.trim()) return landingPages;
    
    const lowercaseQuery = query.toLowerCase();
    return landingPages.filter(lp => 
      lp.name.toLowerCase().includes(lowercaseQuery) ||
      lp.title.toLowerCase().includes(lowercaseQuery) ||
      lp.description.toLowerCase().includes(lowercaseQuery) ||
      lp.slug.toLowerCase().includes(lowercaseQuery)
    );
  }, [landingPages]);

  const getPublishedLandingPages = useCallback((): LandingPage[] => {
    return landingPages.filter(lp => lp.status === LandingPageStatus.PUBLISHED);
  }, [landingPages]);

  const getDraftLandingPages = useCallback((): LandingPage[] => {
    return landingPages.filter(lp => lp.status === LandingPageStatus.DRAFT);
  }, [landingPages]);

  // Analytics
  const getAnalytics = useCallback(async (id: string): Promise<any> => {
    try {
      const response = await fetch(`/api/landing-pages/${id}/analytics`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      throw err;
    }
  }, []);

  const getConversionRate = useCallback(async (id: string): Promise<number> => {
    try {
      const response = await fetch(`/api/landing-pages/${id}/conversion-rate`);
      const data = await response.json();
      return data.conversionRate;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch conversion rate');
      throw err;
    }
  }, []);

  const getTrafficData = useCallback(async (id: string, timeRange: string): Promise<any> => {
    try {
      const response = await fetch(`/api/landing-pages/${id}/traffic?timeRange=${timeRange}`);
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch traffic data');
      throw err;
    }
  }, []);

  // Pagination handlers
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.lastPage) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  }, [pagination.lastPage]);

  const nextPage = useCallback(() => {
    if (pagination.hasNextPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [pagination.hasNextPage]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrevPage) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }));
    }
  }, [pagination.hasPrevPage]);

  // Memoized values
  const memoizedPagination = useMemo(() => ({
    ...pagination,
    goToPage,
    nextPage,
    prevPage
  }), [pagination, goToPage, nextPage, prevPage]);

  return {
    // Data
    landingPages,
    loading,
    error,
    
    // Filters & Search
    filters,
    setFilters,
    updateFilter,
    clearFilters,
    
    // CRUD Operations
    createLandingPage,
    updateLandingPage,
    deleteLandingPage,
    duplicateLandingPage,
    publishLandingPage,
    unpublishLandingPage,
    
    // Content Management
    updateContent,
    updateDesign,
    updateSEO,
    addSection,
    updateSection,
    removeSection,
    reorderSections,
    
    // Bulk Operations
    bulkUpdate,
    bulkDelete,
    bulkPublish,
    bulkUnpublish,
    
    // Utilities
    refresh,
    getLandingPage,
    getLandingPagesByStatus,
    getLandingPagesByProduct,
    searchLandingPages,
    getPublishedLandingPages,
    getDraftLandingPages,
    
    // Analytics
    getAnalytics,
    getConversionRate,
    getTrafficData,
    
    // Pagination
    pagination: memoizedPagination
  };
};
