// ========================================
// LEADS STORE - ZUSTAND TIPADO
// ========================================
// Store principal para gerenciamento de estado do módulo Leads
// Máximo: 300 linhas

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import {
  Lead,
  LeadFilters,
  LeadFormData,
  LeadMetrics,
  LeadSegment,
  LeadTag,
  LeadActivity,
  LeadAnalytics,
  LeadPerformance,
  LeadEngagement,
  LeadHealthScore,
  LeadAttribution,
  LeadForecast,
  LeadSource,
  LeadROI,
  LeadCustomField,
  LeadNote,
  LeadTask,
  LeadDocument,
  LeadExportOptions,
  LeadImportResult
} from '../types';

// ========================================
// INTERFACES
// ========================================

interface LeadsState {
  // Core Data
  leads: Lead[];
  currentLead: Lead | null;
  segments: LeadSegment[];
  tags: LeadTag[];
  customFields: LeadCustomField[];
  
  // Analytics Data
  metrics: LeadMetrics | null;
  analytics: LeadAnalytics[];
  performance: LeadPerformance[];
  engagement: LeadEngagement[];
  healthScores: LeadHealthScore[];
  attribution: LeadAttribution[];
  forecasts: LeadForecast[];
  sources: LeadSource[];
  roi: LeadROI[];
  
  // Activities and Notes
  activities: LeadActivity[];
  notes: LeadNote[];
  tasks: LeadTask[];
  documents: LeadDocument[];
  
  // UI State
  loading: boolean;
  error: string | null;
  filters: LeadFilters;
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  
  // Project State
  projectSettings: any;
  projectActive: boolean;
  
  // Cache
  lastFetch: number;
  cacheExpiry: number;
}

interface LeadsActions {
  // Core Actions
  setLeads: (leads: Lead[]) => void;
  addLead: (lead: Lead) => void;
  updateLead: (id: number, lead: Partial<Lead>) => void;
  removeLead: (id: number) => void;
  setCurrentLead: (lead: Lead | null) => void;
  
  // Segments Actions
  setSegments: (segments: LeadSegment[]) => void;
  addSegment: (segment: LeadSegment) => void;
  updateSegment: (id: number, segment: Partial<LeadSegment>) => void;
  removeSegment: (id: number) => void;
  
  // Tags Actions
  setTags: (tags: LeadTag[]) => void;
  addTag: (tag: LeadTag) => void;
  updateTag: (id: number, tag: Partial<LeadTag>) => void;
  removeTag: (id: number) => void;
  
  // Custom Fields Actions
  setCustomFields: (fields: LeadCustomField[]) => void;
  addCustomField: (field: LeadCustomField) => void;
  updateCustomField: (id: number, field: Partial<LeadCustomField>) => void;
  removeCustomField: (id: number) => void;
  
  // Analytics Actions
  setMetrics: (metrics: LeadMetrics | null) => void;
  setAnalytics: (analytics: LeadAnalytics[]) => void;
  setPerformance: (performance: LeadPerformance[]) => void;
  setEngagement: (engagement: LeadEngagement[]) => void;
  setHealthScores: (healthScores: LeadHealthScore[]) => void;
  setAttribution: (attribution: LeadAttribution[]) => void;
  setForecasts: (forecasts: LeadForecast[]) => void;
  setSources: (sources: LeadSource[]) => void;
  setROI: (roi: LeadROI[]) => void;
  
  // Activities Actions
  setActivities: (activities: LeadActivity[]) => void;
  addActivity: (activity: LeadActivity) => void;
  setNotes: (notes: LeadNote[]) => void;
  addNote: (note: LeadNote) => void;
  setTasks: (tasks: LeadTask[]) => void;
  addTask: (task: LeadTask) => void;
  setDocuments: (documents: LeadDocument[]) => void;
  addDocument: (document: LeadDocument) => void;
  
  // UI Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: LeadFilters) => void;
  updateFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: LeadsState['pagination']) => void;
  
  // Project Actions
  setProjectSettings: (settings: any) => void;
  setProjectActive: (active: boolean) => void;
  
  // Cache Actions
  setLastFetch: (timestamp: number) => void;
  isCacheValid: () => boolean;
  clearCache: () => void;
  
  // Bulk Actions
  bulkUpdateLeads: (ids: number[], updates: Partial<Lead>) => void;
  bulkRemoveLeads: (ids: number[]) => void;
  
  // Utility Actions
  clearError: () => void;
  reset: () => void;
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

const DEFAULT_STATE: LeadsState = {
  // Core Data
  leads: [],
  currentLead: null,
  segments: [],
  tags: [],
  customFields: [],
  
  // Analytics Data
  metrics: null,
  analytics: [],
  performance: [],
  engagement: [],
  healthScores: [],
  attribution: [],
  forecasts: [],
  sources: [],
  roi: [],
  
  // Activities and Notes
  activities: [],
  notes: [],
  tasks: [],
  documents: [],
  
  // UI State
  loading: false,
  error: null,
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  
  // Project State
  projectSettings: null,
  projectActive: true,
  
  // Cache
  lastFetch: 0,
  cacheExpiry: 5 * 60 * 1000 // 5 minutes
};

// ========================================
// STORE IMPLEMENTATION
// ========================================

export const useLeadsStore = create<LeadsState & LeadsActions>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...DEFAULT_STATE,
        
        // ========================================
        // CORE ACTIONS
        // ========================================
        
        setLeads: (leads: Lead[]) => set((state) => {
          state.leads = leads;
          state.lastFetch = Date.now();
        }),
        
        addLead: (lead: Lead) => set((state) => {
          state.leads.unshift(lead);
        }),
        
        updateLead: (id: number, updates: Partial<Lead>) => set((state) => {
          const index = state.leads.findIndex(lead => lead.id === id);
          if (index !== -1) {
            state.leads[index] = { ...state.leads[index], ...updates };
          }
          if (state.currentLead?.id === id) {
            state.currentLead = { ...state.currentLead, ...updates };
          }
        }),
        
        removeLead: (id: number) => set((state) => {
          state.leads = state.leads.filter(lead => lead.id !== id);
          if (state.currentLead?.id === id) {
            state.currentLead = null;
          }
        }),
        
        setCurrentLead: (lead: Lead | null) => set((state) => {
          state.currentLead = lead;
        }),
        
        // ========================================
        // SEGMENTS ACTIONS
        // ========================================
        
        setSegments: (segments: LeadSegment[]) => set((state) => {
          state.segments = segments;
        }),
        
        addSegment: (segment: LeadSegment) => set((state) => {
          state.segments.unshift(segment);
        }),
        
        updateSegment: (id: number, updates: Partial<LeadSegment>) => set((state) => {
          const index = state.segments.findIndex(segment => segment.id === id);
          if (index !== -1) {
            state.segments[index] = { ...state.segments[index], ...updates };
          }
        }),
        
        removeSegment: (id: number) => set((state) => {
          state.segments = state.segments.filter(segment => segment.id !== id);
        }),
        
        // ========================================
        // TAGS ACTIONS
        // ========================================
        
        setTags: (tags: LeadTag[]) => set((state) => {
          state.tags = tags;
        }),
        
        addTag: (tag: LeadTag) => set((state) => {
          state.tags.unshift(tag);
        }),
        
        updateTag: (id: number, updates: Partial<LeadTag>) => set((state) => {
          const index = state.tags.findIndex(tag => tag.id === id);
          if (index !== -1) {
            state.tags[index] = { ...state.tags[index], ...updates };
          }
        }),
        
        removeTag: (id: number) => set((state) => {
          state.tags = state.tags.filter(tag => tag.id !== id);
        }),
        
        // ========================================
        // CUSTOM FIELDS ACTIONS
        // ========================================
        
        setCustomFields: (fields: LeadCustomField[]) => set((state) => {
          state.customFields = fields;
        }),
        
        addCustomField: (field: LeadCustomField) => set((state) => {
          state.customFields.unshift(field);
        }),
        
        updateCustomField: (id: number, updates: Partial<LeadCustomField>) => set((state) => {
          const index = state.customFields.findIndex(field => field.id === id);
          if (index !== -1) {
            state.customFields[index] = { ...state.customFields[index], ...updates };
          }
        }),
        
        removeCustomField: (id: number) => set((state) => {
          state.customFields = state.customFields.filter(field => field.id !== id);
        }),
        
        // ========================================
        // ANALYTICS ACTIONS
        // ========================================
        
        setMetrics: (metrics: LeadMetrics | null) => set((state) => {
          state.metrics = metrics;
        }),
        
        setAnalytics: (analytics: LeadAnalytics[]) => set((state) => {
          state.analytics = analytics;
        }),
        
        setPerformance: (performance: LeadPerformance[]) => set((state) => {
          state.performance = performance;
        }),
        
        setEngagement: (engagement: LeadEngagement[]) => set((state) => {
          state.engagement = engagement;
        }),
        
        setHealthScores: (healthScores: LeadHealthScore[]) => set((state) => {
          state.healthScores = healthScores;
        }),
        
        setAttribution: (attribution: LeadAttribution[]) => set((state) => {
          state.attribution = attribution;
        }),
        
        setForecasts: (forecasts: LeadForecast[]) => set((state) => {
          state.forecasts = forecasts;
        }),
        
        setSources: (sources: LeadSource[]) => set((state) => {
          state.sources = sources;
        }),
        
        setROI: (roi: LeadROI[]) => set((state) => {
          state.roi = roi;
        }),
        
        // ========================================
        // ACTIVITIES ACTIONS
        // ========================================
        
        setActivities: (activities: LeadActivity[]) => set((state) => {
          state.activities = activities;
        }),
        
        addActivity: (activity: LeadActivity) => set((state) => {
          state.activities.unshift(activity);
        }),
        
        setNotes: (notes: LeadNote[]) => set((state) => {
          state.notes = notes;
        }),
        
        addNote: (note: LeadNote) => set((state) => {
          state.notes.unshift(note);
        }),
        
        setTasks: (tasks: LeadTask[]) => set((state) => {
          state.tasks = tasks;
        }),
        
        addTask: (task: LeadTask) => set((state) => {
          state.tasks.unshift(task);
        }),
        
        setDocuments: (documents: LeadDocument[]) => set((state) => {
          state.documents = documents;
        }),
        
        addDocument: (document: LeadDocument) => set((state) => {
          state.documents.unshift(document);
        }),
        
        // ========================================
        // UI ACTIONS
        // ========================================
        
        setLoading: (loading: boolean) => set((state) => {
          state.loading = loading;
        }),
        
        setError: (error: string | null) => set((state) => {
          state.error = error;
        }),
        
        setFilters: (filters: LeadFilters) => set((state) => {
          state.filters = filters;
        }),
        
        updateFilters: (filters: Partial<LeadFilters>) => set((state) => {
          state.filters = { ...state.filters, ...filters };
        }),
        
        resetFilters: () => set((state) => {
          state.filters = DEFAULT_FILTERS;
        }),
        
        setPagination: (pagination: LeadsState['pagination']) => set((state) => {
          state.pagination = pagination;
        }),
        
        // ========================================
        // PROJECT ACTIONS
        // ========================================
        
        setProjectSettings: (settings: any) => set((state) => {
          state.projectSettings = settings;
        }),
        
        setProjectActive: (active: boolean) => set((state) => {
          state.projectActive = active;
        }),
        
        // ========================================
        // CACHE ACTIONS
        // ========================================
        
        setLastFetch: (timestamp: number) => set((state) => {
          state.lastFetch = timestamp;
        }),
        
        isCacheValid: () => {
          const state = get();
          return Date.now() - state.lastFetch < state.cacheExpiry;
        },
        
        clearCache: () => set((state) => {
          state.lastFetch = 0;
        }),
        
        // ========================================
        // BULK ACTIONS
        // ========================================
        
        bulkUpdateLeads: (ids: number[], updates: Partial<Lead>) => set((state) => {
          state.leads = state.leads.map(lead => 
            ids.includes(lead.id) ? { ...lead, ...updates } : lead
          );
        }),
        
        bulkRemoveLeads: (ids: number[]) => set((state) => {
          state.leads = state.leads.filter(lead => !ids.includes(lead.id));
        }),
        
        // ========================================
        // UTILITY ACTIONS
        // ========================================
        
        clearError: () => set((state) => {
          state.error = null;
        }),
        
        reset: () => set(() => ({ ...DEFAULT_STATE }))
      })),
      {
        name: 'leads-store',
        partialize: (state) => ({
          filters: state.filters,
          projectSettings: state.projectSettings,
          projectActive: state.projectActive,
          lastFetch: state.lastFetch
        })
      }
    ),
    {
      name: 'leads-store'
    }
  )
);

// ========================================
// SELECTORS
// ========================================

export const useLeads = () => useLeadsStore((state) => state.leads);
export const useCurrentLead = () => useLeadsStore((state) => state.currentLead);
export const useSegments = () => useLeadsStore((state) => state.segments);
export const useTags = () => useLeadsStore((state) => state.tags);
export const useCustomFields = () => useLeadsStore((state) => state.customFields);
export const useMetrics = () => useLeadsStore((state) => state.metrics);
export const useAnalytics = () => useLeadsStore((state) => state.analytics);
export const usePerformance = () => useLeadsStore((state) => state.performance);
export const useEngagement = () => useLeadsStore((state) => state.engagement);
export const useHealthScores = () => useLeadsStore((state) => state.healthScores);
export const useAttribution = () => useLeadsStore((state) => state.attribution);
export const useForecasts = () => useLeadsStore((state) => state.forecasts);
export const useSources = () => useLeadsStore((state) => state.sources);
export const useROI = () => useLeadsStore((state) => state.roi);
export const useActivities = () => useLeadsStore((state) => state.activities);
export const useNotes = () => useLeadsStore((state) => state.notes);
export const useTasks = () => useLeadsStore((state) => state.tasks);
export const useDocuments = () => useLeadsStore((state) => state.documents);
export const useLoading = () => useLeadsStore((state) => state.loading);
export const useError = () => useLeadsStore((state) => state.error);
export const useFilters = () => useLeadsStore((state) => state.filters);
export const usePagination = () => useLeadsStore((state) => state.pagination);
export const useProjectSettings = () => useLeadsStore((state) => state.projectSettings);
export const useProjectActive = () => useLeadsStore((state) => state.projectActive);
export const useIsCacheValid = () => useLeadsStore((state) => state.isCacheValid());
