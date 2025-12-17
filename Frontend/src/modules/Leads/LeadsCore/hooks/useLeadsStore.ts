// ========================================
// LEADS STORE - ZUSTAND TIPADO
// ========================================
// Store global para gerenciamento de estado do módulo Leads
// Máximo: 300 linhas

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Lead, LeadFilters, LeadMetrics, LeadAnalytics, LeadSegment, LeadTag, LeadCustomField, DEFAULT_LEAD_FILTERS } from '@/types';

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
  to: number; };

  // Filters
  filters: LeadFilters;
  
  // Cache
  lastFetch: number;
  cacheExpiry: number;
}

interface LeadsActions {
  // Core actions
  setLeads?: (e: any) => void;
  addLead?: (e: any) => void;
  updateLead?: (e: any) => void;
  removeLead?: (e: any) => void;
  setCurrentLead?: (e: any) => void;
  // Segments actions
  setSegments?: (e: any) => void;
  addSegment?: (e: any) => void;
  updateSegment?: (e: any) => void;
  removeSegment?: (e: any) => void;
  // Tags actions
  setTags?: (e: any) => void;
  addTag?: (e: any) => void;
  updateTag?: (e: any) => void;
  removeTag?: (e: any) => void;
  // Custom fields actions
  setCustomFields?: (e: any) => void;
  addCustomField?: (e: any) => void;
  updateCustomField?: (e: any) => void;
  removeCustomField?: (e: any) => void;
  // Analytics actions
  setMetrics?: (e: any) => void;
  setAnalytics?: (e: any) => void;
  // UI actions
  setLoading?: (e: any) => void;
  setError?: (e: any) => void;
  clearError??: (e: any) => void;
  // Pagination actions
  setPagination?: (e: any) => void;
  goToPage?: (e: any) => void;
  nextPage??: (e: any) => void;
  prevPage??: (e: any) => void;
  // Filters actions
  setFilters?: (e: any) => void;
  clearFilters??: (e: any) => void;
  applyFilters?: (e: any) => void;
  // Cache actions
  updateCache??: (e: any) => void;
  isCacheValid: () => boolean;
  clearCache??: (e: any) => void;
  // Reset actions
  reset??: (e: any) => void;
  resetLeads??: (e: any) => void;
  resetAnalytics??: (e: any) => void; }

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
  cacheExpiry: 5 * 60 * 1000 // 5 minutes};

// ===== STORE CREATION =====
export const useLeadsStore = create<LeadsStore>()(
  devtools(
    persist(
      immer((set: unknown, get: unknown) => ({
        ...initialState,

        // Core actions
        setLeads: (leads: unknown) => set((state: unknown) => {
          state.leads = leads;
          state.lastFetch = Date.now();

        }),

        addLead: (lead: unknown) => set((state: unknown) => {
          state.leads.unshift(lead);

          state.pagination.total += 1;
        }),

        updateLead: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.leads.findIndex(lead => lead.id === id);

          if (index !== -1) {
            state.leads[index] = { ...state.leads[index], ...updates};

          }
          if (state.currentLead?.id === id) {
            state.currentLead = { ...state.currentLead, ...updates};

          } ),

        removeLead: (id: unknown) => set((state: unknown) => {
          state.leads = state.leads.filter(lead => lead.id !== id);

          state.pagination.total -= 1;
          if (state.currentLead?.id === id) {
            state.currentLead = null;
          } ),

        setCurrentLead: (lead: unknown) => set((state: unknown) => {
          state.currentLead = lead;
        }),

        // Segments actions
        setSegments: (segments: unknown) => set((state: unknown) => {
          state.segments = segments;
        }),

        addSegment: (segment: unknown) => set((state: unknown) => {
          state.segments.push(segment);

        }),

        updateSegment: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.segments.findIndex(segment => segment.id === id);

          if (index !== -1) {
            state.segments[index] = { ...state.segments[index], ...updates};

          } ),

        removeSegment: (id: unknown) => set((state: unknown) => {
          state.segments = state.segments.filter(segment => segment.id !== id);

        }),

        // Tags actions
        setTags: (tags: unknown) => set((state: unknown) => {
          state.tags = tags;
        }),

        addTag: (tag: unknown) => set((state: unknown) => {
          state.tags.push(tag);

        }),

        updateTag: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.tags.findIndex(tag => tag.id === id);

          if (index !== -1) {
            state.tags[index] = { ...state.tags[index], ...updates};

          } ),

        removeTag: (id: unknown) => set((state: unknown) => {
          state.tags = state.tags.filter(tag => tag.id !== id);

        }),

        // Custom fields actions
        setCustomFields: (fields: unknown) => set((state: unknown) => {
          state.customFields = fields;
        }),

        addCustomField: (field: unknown) => set((state: unknown) => {
          state.customFields.push(field);

        }),

        updateCustomField: (id: unknown, updates: unknown) => set((state: unknown) => {
          const index = state.customFields.findIndex(field => field.id === id);

          if (index !== -1) {
            state.customFields[index] = { ...state.customFields[index], ...updates};

          } ),

        removeCustomField: (id: unknown) => set((state: unknown) => {
          state.customFields = state.customFields.filter(field => field.id !== id);

        }),

        // Analytics actions
        setMetrics: (metrics: unknown) => set((state: unknown) => {
          state.metrics = metrics;
        }),

        setAnalytics: (analytics: unknown) => set((state: unknown) => {
          state.analytics = analytics;
        }),

        // UI actions
        setLoading: (loading: unknown) => set((state: unknown) => {
          state.loading = loading;
        }),

        setError: (error: unknown) => set((state: unknown) => {
          state.error = error;
        }),

        clearError: () => set((state: unknown) => {
          state.error = null;
        }),

        // Pagination actions
        setPagination: (pagination: unknown) => set((state: unknown) => {
          state.pagination = { ...state.pagination, ...pagination};

        }),

        goToPage: (page: unknown) => set((state: unknown) => {
          state.pagination.current_page = page;
        }),

        nextPage: () => set((state: unknown) => {
          if (state.pagination.current_page < state.pagination.last_page) {
            state.pagination.current_page += 1;
          } ),

        prevPage: () => set((state: unknown) => {
          if (state.pagination.current_page > 1) {
            state.pagination.current_page -= 1;
          } ),

        // Filters actions
        setFilters: (filters: unknown) => set((state: unknown) => {
          state.filters = { ...state.filters, ...filters};

        }),

        clearFilters: () => set((state: unknown) => {
          state.filters = { ...DEFAULT_LEAD_FILTERS};

        }),

        applyFilters: (filters: unknown) => set((state: unknown) => {
          state.filters = filters;
          state.pagination.current_page = 1;
        }),

        // Cache actions
        updateCache: () => set((state: unknown) => {
          state.lastFetch = Date.now();

        }),

        isCacheValid: () => {
          const state = get();

          return Date.now() - state.lastFetch < state.cacheExpiry;
        },

        clearCache: () => set((state: unknown) => {
          state.lastFetch = 0;
        }),

        // Reset actions
        reset: () => set(() => ({ ...initialState })),

        resetLeads: () => set((state: unknown) => {
          state.leads = [];
          state.currentLead = null;
          state.pagination = initialState.pagination;
        }),

        resetAnalytics: () => set((state: unknown) => {
          state.metrics = null;
          state.analytics = null;
        })
  })),
      {
        name: 'leads-store',
        partialize: (state: unknown) => ({
          filters: state.filters,
          pagination: state.pagination,
          lastFetch: state.lastFetch
        })
  }
    ),
    {
      name: 'leads-store'
    }
  ));

// ===== SELECTORS =====
export const useLeadsSelector = <T>(selector: (state: LeadsStore) => T) => 
  useLeadsStore(selector);

export const useLeadsData = () => useLeadsStore((state: unknown) => ({
  leads: state.leads,
  currentLead: state.currentLead,
  segments: state.segments,
  tags: state.tags,
  customFields: state.customFields
}));

export const useLeadsUI = () => useLeadsStore((state: unknown) => ({
  loading: state.loading,
  error: state.error,
  pagination: state.pagination
}));

export const useLeadsFilters = () => useLeadsStore((state: unknown) => ({
  filters: state.filters,
  setFilters: state.setFilters,
  clearFilters: state.clearFilters,
  applyFilters: state.applyFilters
}));

export const useLeadsAnalytics = () => useLeadsStore((state: unknown) => ({
  metrics: state.metrics,
  analytics: state.analytics
}));

export default useLeadsStore;
