// ========================================
// USE LEADS CORE HOOK
// ========================================
// Hook para funcionalidades básicas do módulo Leads
// Máximo: 200 linhas

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';
import {
  fetchLeads,
  fetchLeadById,
  createLead,
  updateLead,
  deleteLead,
  bulkUpdateLeads,
  bulkDeleteLeads,
  fetchLeadActivities,
  createLeadActivity,
  checkProjectStatus,
  getProjectSettings
} from '../services/leadsCoreService';
import {
  Lead,
  LeadFilters,
  LeadFormData,
  LeadActivity,
  LeadListResponse,
  LeadResponse,
  LeadBulkResponse
} from '../types';

// ========================================
// INTERFACES
// ========================================

interface UseLeadsCoreState {
  leads: Lead[];
  currentLead: Lead | null;
  activities: LeadActivity[];
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  filters: LeadFilters;
  projectSettings: any;
  projectActive: boolean;
}

interface UseLeadsCoreActions {
  // CRUD Operations
  createLead: (data: LeadFormData) => Promise<Lead | null>;
  updateLead: (id: number, data: Partial<LeadFormData>) => Promise<Lead | null>;
  deleteLead: (id: number) => Promise<boolean>;
  getLead: (id: number) => Promise<Lead | null>;
  
  // Bulk Operations
  bulkUpdate: (ids: number[], data: Partial<LeadFormData>) => Promise<boolean>;
  bulkDelete: (ids: number[]) => Promise<boolean>;
  
  // Activities
  fetchActivities: (leadId: number) => Promise<void>;
  addActivity: (leadId: number, activity: Omit<LeadActivity, 'id' | 'lead_id' | 'created_at'>) => Promise<boolean>;
  
  // Filters and Search
  setFilters: (filters: LeadFilters) => void;
  resetFilters: () => void;
  searchLeads: (filters?: LeadFilters) => Promise<void>;
  
  // Pagination
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  
  // Project Management
  checkProject: () => Promise<void>;
  refreshProjectSettings: () => Promise<void>;
  
  // State Management
  setCurrentLead: (lead: Lead | null) => void;
  clearError: () => void;
  refreshLeads: () => Promise<void>;
}

// ========================================
// DEFAULT VALUES
// ========================================

const DEFAULT_FILTERS: LeadFilters = {
  page: 1,
  per_page: 10,
  sort_by: 'created_at',
  sort_order: 'desc'
};

const DEFAULT_PAGINATION = {
  current_page: 1,
  total_pages: 1,
  total_items: 0,
  items_per_page: 10
};

// ========================================
// HOOK IMPLEMENTATION
// ========================================

export const useLeadsCore = (): UseLeadsCoreState & UseLeadsCoreActions => {
  // ========================================
  // STATE
  // ========================================
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [filters, setFiltersState] = useState<LeadFilters>(DEFAULT_FILTERS);
  const [projectSettings, setProjectSettings] = useState<any>(null);
  const [projectActive, setProjectActive] = useState<boolean>(true);

  // ========================================
  // COMPUTED VALUES
  // ========================================
  
  const filteredLeads = useMemo(() => {
    if (!filters.search) return leads;
    
    const searchTerm = filters.search.toLowerCase();
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm) ||
      lead.company?.toLowerCase().includes(searchTerm) ||
      lead.phone?.includes(searchTerm)
    );
  }, [leads, filters.search]);

  // ========================================
  // API CALLS
  // ========================================
  
  const searchLeads = useCallback(async (searchFilters?: LeadFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      const currentFilters = searchFilters || filters;
      const response: LeadListResponse = await fetchLeads(currentFilters);
      
      if (response.success) {
        setLeads(response.data.leads);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch leads');
        toast.error(response.message || 'Failed to fetch leads');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching leads';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getLead = useCallback(async (id: number): Promise<Lead | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: LeadResponse = await fetchLeadById(id);
      
      if (response.success) {
        setCurrentLead(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch lead');
        toast.error(response.message || 'Failed to fetch lead');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createLeadAction = useCallback(async (data: LeadFormData): Promise<Lead | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: LeadResponse = await createLead(data);
      
      if (response.success) {
        setLeads(prev => [response.data, ...prev]);
        toast.success('Lead created successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to create lead');
        toast.error(response.message || 'Failed to create lead');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while creating lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateLeadAction = useCallback(async (id: number, data: Partial<LeadFormData>): Promise<Lead | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: LeadResponse = await updateLead(id, data);
      
      if (response.success) {
        setLeads(prev => prev.map(lead => lead.id === id ? response.data : lead));
        if (currentLead?.id === id) {
          setCurrentLead(response.data);
        }
        toast.success('Lead updated successfully');
        return response.data;
      } else {
        setError(response.message || 'Failed to update lead');
        toast.error(response.message || 'Failed to update lead');
        return null;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while updating lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentLead]);

  const deleteLeadAction = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await deleteLead(id);
      
      if (response.success) {
        setLeads(prev => prev.filter(lead => lead.id !== id));
        if (currentLead?.id === id) {
          setCurrentLead(null);
        }
        toast.success('Lead deleted successfully');
        return true;
      } else {
        setError(response.message || 'Failed to delete lead');
        toast.error(response.message || 'Failed to delete lead');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while deleting lead';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentLead]);

  const bulkUpdate = useCallback(async (ids: number[], data: Partial<LeadFormData>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: LeadBulkResponse = await bulkUpdateLeads(ids, data);
      
      if (response.success) {
        // Refresh leads to get updated data
        await searchLeads();
        toast.success(`Updated ${response.data.successful} leads successfully`);
        return true;
      } else {
        setError(response.message || 'Failed to bulk update leads');
        toast.error(response.message || 'Failed to bulk update leads');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while bulk updating leads';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [searchLeads]);

  const bulkDelete = useCallback(async (ids: number[]): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response: LeadBulkResponse = await bulkDeleteLeads(ids);
      
      if (response.success) {
        setLeads(prev => prev.filter(lead => !ids.includes(lead.id)));
        toast.success(`Deleted ${response.data.successful} leads successfully`);
        return true;
      } else {
        setError(response.message || 'Failed to bulk delete leads');
        toast.error(response.message || 'Failed to bulk delete leads');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while bulk deleting leads';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async (leadId: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchLeadActivities(leadId);
      
      if (response.success) {
        setActivities(response.data);
      } else {
        setError(response.message || 'Failed to fetch activities');
        toast.error(response.message || 'Failed to fetch activities');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while fetching activities';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const addActivity = useCallback(async (leadId: number, activity: Omit<LeadActivity, 'id' | 'lead_id' | 'created_at'>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await createLeadActivity(leadId, activity);
      
      if (response.success) {
        setActivities(prev => [response.data, ...prev]);
        toast.success('Activity added successfully');
        return true;
      } else {
        setError(response.message || 'Failed to add activity');
        toast.error(response.message || 'Failed to add activity');
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred while adding activity';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkProject = useCallback(async (): Promise<void> => {
    try {
      const response = await checkProjectStatus();
      setProjectActive(response.active);
      if (!response.active) {
        setError('Project is not active');
      }
    } catch (err: any) {
      setError('Failed to check project status');
    }
  }, []);

  const refreshProjectSettings = useCallback(async (): Promise<void> => {
    try {
      const response = await getProjectSettings();
      if (response.success) {
        setProjectSettings(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch project settings:', err);
    }
  }, []);

  // ========================================
  // FILTERS AND PAGINATION
  // ========================================
  
  const setFilters = useCallback((newFilters: LeadFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_FILTERS);
  }, []);

  const setPage = useCallback((page: number) => {
    setFiltersState(prev => ({ ...prev, page }));
  }, []);

  const setItemsPerPage = useCallback((itemsPerPage: number) => {
    setFiltersState(prev => ({ ...prev, per_page: itemsPerPage, page: 1 }));
  }, []);

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshLeads = useCallback(async (): Promise<void> => {
    await searchLeads();
  }, [searchLeads]);

  // ========================================
  // EFFECTS
  // ========================================
  
  useEffect(() => {
    searchLeads();
  }, [filters]);

  useEffect(() => {
    checkProject();
    refreshProjectSettings();
  }, [checkProject, refreshProjectSettings]);

  // ========================================
  // RETURN
  // ========================================
  
  return {
    // State
    leads: filteredLeads,
    currentLead,
    activities,
    loading,
    error,
    pagination,
    filters,
    projectSettings,
    projectActive,
    
    // Computed values
    filteredLeads,
    
    // Actions
    createLead: createLeadAction,
    updateLead: updateLeadAction,
    deleteLead: deleteLeadAction,
    getLead,
    bulkUpdate,
    bulkDelete,
    fetchActivities,
    addActivity,
    setFilters,
    resetFilters,
    searchLeads,
    setPage,
    setItemsPerPage,
    checkProject,
    refreshProjectSettings,
    setCurrentLead,
    clearError,
    refreshLeads
  };
};
