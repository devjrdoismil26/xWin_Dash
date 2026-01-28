// ========================================
// LEADS STORE - ZUSTAND TIPADO
// ========================================
// Store global para gerenciamento de estado do módulo Leads
// Máximo: 300 linhas

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { 
  Lead, 
  LeadFilters, 
  LeadMetrics, 
  LeadAnalytics,
  LeadSegment,
  LeadTag,
  LeadCustomField,
  DEFAULT_LEAD_FILTERS
} from '../../types';

// ===== INTERFACES =====
interface LeadsState {
  // Core data
  leads: Lead[];
  currentLead: Lead | null;
  segments: LeadSegment[];
  tags: LeadTag[];
  customFields: LeadCustomField[];
  
  // Analytics
  metrics: LeadMetrics | null;
  analytics: LeadAnalytics | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Pagination
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  
  // Filters
  filters: LeadFilters;
  
  // Cache
  lastFetch: number;
  cacheExpiry: number;
}

interface LeadsActions {
  // Core actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: number, updates: Partial<Lead>) => void;
  removeLead: (id: number) => void;
  setCurrentLead: (lead: Lead | null) => void;
  
  // Segments actions
  setSegments: (segments: LeadSegment[]) => void;
  addSegment: (segment: LeadSegment) => void;
  updateSegment: (id: number, updates: Partial<LeadSegment>) => void;
  removeSegment: (id: number) => void;
  
  // Tags actions
  setTags: (tags: LeadTag[]) => void;
  addTag: (tag: LeadTag) => void;
  updateTag: (id: number, updates: Partial<LeadTag>) => void;
  removeTag: (id: number) => void;
  
  // Custom fields actions
  setCustomFields: (fields: LeadCustomField[]) => void;
  addCustomField: (field: LeadCustomField) => void;
  updateCustomField: (id: number, updates: Partial<LeadCustomField>) => void;
  removeCustomField: (id: number) => void;
  
  // Analytics actions
  setMetrics: (metrics: LeadMetrics | null) => void;
  setAnalytics: (analytics: LeadAnalytics | null) => void;
  
  // UI actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Pagination actions
  setPagination: (pagination: Partial<LeadsState['pagination']>) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  
  // Filters actions
  setFilters: (filters: Partial<LeadFilters>) => void;
  clearFilters: () => void;
  applyFilters: (filters: LeadFilters) => void;
  
  // Cache actions
  updateCache: () => void;
  isCacheValid: () => boolean;
  clearCache: () => void;
  
  // Reset actions
  reset: () => void;
  resetLeads: () => void;
  resetAnalytics: () => void;
}

type LeadsStore = LeadsState & LeadsActions;

// ===== INITIAL STATE =====
const initialState: LeadsState = {
  leads: [],
  currentLead: null,
  segments: [],
  tags: [],
  customFields: [],
  metrics: null,
  analytics: null,
  loading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 0,
    to: 0
  },
  filters: { ...DEFAULT_LEAD_FILTERS },
  lastFetch: 0,
  cacheExpiry: 5 * 60 * 1000 // 5 minutes
};

// ===== STORE CREATION =====
export const useLeadsStore = create<LeadsStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Core actions
        setLeads: (leads) => set((state) => {
          state.leads = leads;
          state.lastFetch = Date.now();
        }),

        addLead: (lead) => set((state) => {
          state.leads.unshift(lead);
          state.pagination.total += 1;
        }),

        updateLead: (id, updates) => set((state) => {
          const index = state.leads.findIndex(lead => lead.id === id);
          if (index !== -1) {
            state.leads[index] = { ...state.leads[index], ...updates };
          }
          if (state.currentLead?.id === id) {
            state.currentLead = { ...state.currentLead, ...updates };
          }
        }),

        removeLead: (id) => set((state) => {
          state.leads = state.leads.filter(lead => lead.id !== id);
          state.pagination.total -= 1;
          if (state.currentLead?.id === id) {
            state.currentLead = null;
          }
        }),

        setCurrentLead: (lead) => set((state) => {
          state.currentLead = lead;
        }),

        // Segments actions
        setSegments: (segments) => set((state) => {
          state.segments = segments;
        }),

        addSegment: (segment) => set((state) => {
          state.segments.push(segment);
        }),

        updateSegment: (id, updates) => set((state) => {
          const index = state.segments.findIndex(segment => segment.id === id);
          if (index !== -1) {
            state.segments[index] = { ...state.segments[index], ...updates };
          }
        }),

        removeSegment: (id) => set((state) => {
          state.segments = state.segments.filter(segment => segment.id !== id);
        }),

        // Tags actions
        setTags: (tags) => set((state) => {
          state.tags = tags;
        }),

        addTag: (tag) => set((state) => {
          state.tags.push(tag);
        }),

        updateTag: (id, updates) => set((state) => {
          const index = state.tags.findIndex(tag => tag.id === id);
          if (index !== -1) {
            state.tags[index] = { ...state.tags[index], ...updates };
          }
        }),

        removeTag: (id) => set((state) => {
          state.tags = state.tags.filter(tag => tag.id !== id);
        }),

        // Custom fields actions
        setCustomFields: (fields) => set((state) => {
          state.customFields = fields;
        }),

        addCustomField: (field) => set((state) => {
          state.customFields.push(field);
        }),

        updateCustomField: (id, updates) => set((state) => {
          const index = state.customFields.findIndex(field => field.id === id);
          if (index !== -1) {
            state.customFields[index] = { ...state.customFields[index], ...updates };
          }
        }),

        removeCustomField: (id) => set((state) => {
          state.customFields = state.customFields.filter(field => field.id !== id);
        }),

        // Analytics actions
        setMetrics: (metrics) => set((state) => {
          state.metrics = metrics;
        }),

        setAnalytics: (analytics) => set((state) => {
          state.analytics = analytics;
        }),

        // UI actions
        setLoading: (loading) => set((state) => {
          state.loading = loading;
        }),

        setError: (error) => set((state) => {
          state.error = error;
        }),

        clearError: () => set((state) => {
          state.error = null;
        }),

        // Pagination actions
        setPagination: (pagination) => set((state) => {
          state.pagination = { ...state.pagination, ...pagination };
        }),

        goToPage: (page) => set((state) => {
          state.pagination.current_page = page;
        }),

        nextPage: () => set((state) => {
          if (state.pagination.current_page < state.pagination.last_page) {
            state.pagination.current_page += 1;
          }
        }),

        prevPage: () => set((state) => {
          if (state.pagination.current_page > 1) {
            state.pagination.current_page -= 1;
          }
        }),

        // Filters actions
        setFilters: (filters) => set((state) => {
          state.filters = { ...state.filters, ...filters };
        }),

        clearFilters: () => set((state) => {
          state.filters = { ...DEFAULT_LEAD_FILTERS };
        }),

        applyFilters: (filters) => set((state) => {
          state.filters = filters;
          state.pagination.current_page = 1;
        }),

        // Cache actions
        updateCache: () => set((state) => {
          state.lastFetch = Date.now();
        }),

        isCacheValid: () => {
          const state = get();
          return Date.now() - state.lastFetch < state.cacheExpiry;
        },

        clearCache: () => set((state) => {
          state.lastFetch = 0;
        }),

        // Reset actions
        reset: () => set(() => ({ ...initialState })),

        resetLeads: () => set((state) => {
          state.leads = [];
          state.currentLead = null;
          state.pagination = initialState.pagination;
        }),

        resetAnalytics: () => set((state) => {
          state.metrics = null;
          state.analytics = null;
        })
      })),
      {
        name: 'leads-store',
        partialize: (state) => ({
          filters: state.filters,
          pagination: state.pagination,
          lastFetch: state.lastFetch
        })
      }
    ),
    {
      name: 'leads-store'
    }
  )
);

// ===== SELECTORS =====
export const useLeadsSelector = <T>(selector: (state: LeadsStore) => T) => 
  useLeadsStore(selector);

export const useLeadsData = () => useLeadsStore((state) => ({
  leads: state.leads,
  currentLead: state.currentLead,
  segments: state.segments,
  tags: state.tags,
  customFields: state.customFields
}));

export const useLeadsUI = () => useLeadsStore((state) => ({
  loading: state.loading,
  error: state.error,
  pagination: state.pagination
}));

export const useLeadsFilters = () => useLeadsStore((state) => ({
  filters: state.filters,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  applyFilters: state.applyFilters
}));

export const useLeadsAnalytics = () => useLeadsStore((state) => ({
  metrics: state.metrics,
  analytics: state.analytics
}));

export default useLeadsStore;
