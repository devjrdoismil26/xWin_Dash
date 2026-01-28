// ========================================
// USE LEADS - HOOK ORQUESTRADOR PRINCIPAL
// ========================================
// Hook principal que orquestra todos os hooks especializados
// Máximo: 200 linhas

import { useCallback, useEffect } from 'react';
import { useLeadsStore } from './useLeadsStore';
import { useLeadsCore } from '../LeadsCore/hooks/useLeadsCore';
import { useLeadsManager } from '../LeadsManager/hooks/useLeadsManager';
import { useLeadsSegments } from '../LeadsSegments/hooks/useLeadsSegments';
import { useLeadsAnalytics } from '../LeadsAnalytics/hooks/useLeadsAnalytics';
import { useLeadsCustomFields } from '../LeadsCustomFields/hooks/useLeadsCustomFields';
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

interface UseLeadsReturn {
  // State from Store
  leads: Lead[];
  currentLead: Lead | null;
  segments: LeadSegment[];
  tags: LeadTag[];
  customFields: LeadCustomField[];
  metrics: LeadMetrics | null;
  analytics: LeadAnalytics[];
  performance: LeadPerformance[];
  engagement: LeadEngagement[];
  healthScores: LeadHealthScore[];
  attribution: LeadAttribution[];
  forecasts: LeadForecast[];
  sources: LeadSource[];
  roi: LeadROI[];
  activities: LeadActivity[];
  notes: LeadNote[];
  tasks: LeadTask[];
  documents: LeadDocument[];
  loading: boolean;
  error: string | null;
  filters: LeadFilters;
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  projectSettings: any;
  projectActive: boolean;
  
  // Core Actions
  createLead: (data: LeadFormData) => Promise<Lead | null>;
  updateLead: (id: number, data: Partial<LeadFormData>) => Promise<Lead | null>;
  deleteLead: (id: number) => Promise<boolean>;
  getLead: (id: number) => Promise<Lead | null>;
  bulkUpdate: (ids: number[], data: Partial<LeadFormData>) => Promise<boolean>;
  bulkDelete: (ids: number[]) => Promise<boolean>;
  
  // Manager Actions
  updateStatus: (id: number, status: string, reason?: string) => Promise<boolean>;
  updateScore: (id: number, score: number, reason?: string) => Promise<boolean>;
  assign: (id: number, userId: number) => Promise<boolean>;
  unassign: (id: number) => Promise<boolean>;
  duplicate: (id: number) => Promise<Lead | null>;
  merge: (primaryId: number, secondaryId: number, mergedData: Partial<Lead>) => Promise<Lead | null>;
  
  // Segments Actions
  createSegment: (data: Omit<LeadSegment, 'id' | 'created_at' | 'updated_at' | 'lead_count'>) => Promise<LeadSegment | null>;
  updateSegment: (id: number, data: Partial<LeadSegment>) => Promise<LeadSegment | null>;
  deleteSegment: (id: number) => Promise<boolean>;
  calculateSegment: (id: number) => Promise<number>;
  
  // Analytics Actions
  fetchMetrics: (filters?: LeadFilters) => Promise<void>;
  fetchAnalytics: (leadId: number, filters?: { start_date?: string; end_date?: string }) => Promise<void>;
  fetchPerformance: (filters?: LeadFilters) => Promise<void>;
  fetchEngagement: (filters?: LeadFilters) => Promise<void>;
  
  // Custom Fields Actions
  createCustomField: (data: Omit<LeadCustomField, 'id'>) => Promise<LeadCustomField | null>;
  updateCustomField: (id: number, data: Partial<LeadCustomField>) => Promise<LeadCustomField | null>;
  deleteCustomField: (id: number) => Promise<boolean>;
  
  // Activities Actions
  addActivity: (leadId: number, activity: Omit<LeadActivity, 'id' | 'lead_id' | 'created_at'>) => Promise<boolean>;
  addNote: (leadId: number, content: string, isPrivate?: boolean) => Promise<boolean>;
  addTask: (leadId: number, task: Omit<LeadTask, 'id' | 'lead_id' | 'created_at' | 'updated_at'>) => Promise<boolean>;
  uploadDocument: (leadId: number, file: File) => Promise<boolean>;
  
  // Filters and Search
  setFilters: (filters: LeadFilters) => void;
  resetFilters: () => void;
  searchLeads: (filters?: LeadFilters) => Promise<void>;
  
  // Pagination
  setPage: (page: number) => void;
  setItemsPerPage: (itemsPerPage: number) => void;
  
  // State Management
  setCurrentLead: (lead: Lead | null) => void;
  clearError: () => void;
  refreshLeads: () => Promise<void>;
  
  // Project Management
  checkProject: () => Promise<void>;
  refreshProjectSettings: () => Promise<void>;
}

// ========================================
// HOOK IMPLEMENTATION
// ========================================

export const useLeads = (): UseLeadsReturn => {
  // ========================================
  // STORE STATE
  // ========================================
  
  const store = useLeadsStore();
  
  // ========================================
  // SPECIALIZED HOOKS
  // ========================================
  
  const core = useLeadsCore();
  const manager = useLeadsManager();
  const segments = useLeadsSegments();
  const analytics = useLeadsAnalytics();
  const customFields = useLeadsCustomFields();

  // ========================================
  // SYNC STORE WITH HOOKS
  // ========================================
  
  useEffect(() => {
    // Sync core data
    store.setLeads(core.leads);
    store.setCurrentLead(core.currentLead);
    store.setActivities(core.activities);
    store.setLoading(core.loading);
    store.setError(core.error);
    store.setPagination(core.pagination);
    store.setFilters(core.filters);
    store.setProjectSettings(core.projectSettings);
    store.setProjectActive(core.projectActive);
  }, [core, store]);

  useEffect(() => {
    // Sync manager data
    store.setNotes(manager.notes);
    store.setTasks(manager.tasks);
    store.setDocuments(manager.documents);
  }, [manager, store]);

  useEffect(() => {
    // Sync segments data
    store.setSegments(segments.segments);
  }, [segments, store]);

  useEffect(() => {
    // Sync analytics data
    store.setMetrics(analytics.metrics);
    store.setAnalytics(analytics.analytics);
    store.setPerformance(analytics.performance);
    store.setEngagement(analytics.engagement);
    store.setHealthScores(analytics.healthScores);
    store.setAttribution(analytics.attribution);
    store.setForecasts(analytics.forecasts);
    store.setSources(analytics.sources);
    store.setROI(analytics.roi);
  }, [analytics, store]);

  useEffect(() => {
    // Sync custom fields data
    store.setCustomFields(customFields.customFields);
  }, [customFields, store]);

  // ========================================
  // ORCHESTRATED ACTIONS
  // ========================================
  
  const createLead = useCallback(async (data: LeadFormData): Promise<Lead | null> => {
    const result = await core.createLead(data);
    if (result) {
      store.addLead(result);
    }
    return result;
  }, [core, store]);

  const updateLead = useCallback(async (id: number, data: Partial<LeadFormData>): Promise<Lead | null> => {
    const result = await core.updateLead(id, data);
    if (result) {
      store.updateLead(id, result);
    }
    return result;
  }, [core, store]);

  const deleteLead = useCallback(async (id: number): Promise<boolean> => {
    const result = await core.deleteLead(id);
    if (result) {
      store.removeLead(id);
    }
    return result;
  }, [core, store]);

  const getLead = useCallback(async (id: number): Promise<Lead | null> => {
    const result = await core.getLead(id);
    if (result) {
      store.setCurrentLead(result);
    }
    return result;
  }, [core, store]);

  const bulkUpdate = useCallback(async (ids: number[], data: Partial<LeadFormData>): Promise<boolean> => {
    const result = await core.bulkUpdate(ids, data);
    if (result) {
      store.bulkUpdateLeads(ids, data);
    }
    return result;
  }, [core, store]);

  const bulkDelete = useCallback(async (ids: number[]): Promise<boolean> => {
    const result = await core.bulkDelete(ids);
    if (result) {
      store.bulkRemoveLeads(ids);
    }
    return result;
  }, [core, store]);

  const createSegment = useCallback(async (data: Omit<LeadSegment, 'id' | 'created_at' | 'updated_at' | 'lead_count'>): Promise<LeadSegment | null> => {
    const result = await segments.createSegment(data);
    if (result) {
      store.addSegment(result);
    }
    return result;
  }, [segments, store]);

  const updateSegment = useCallback(async (id: number, data: Partial<LeadSegment>): Promise<LeadSegment | null> => {
    const result = await segments.updateSegment(id, data);
    if (result) {
      store.updateSegment(id, result);
    }
    return result;
  }, [segments, store]);

  const deleteSegment = useCallback(async (id: number): Promise<boolean> => {
    const result = await segments.deleteSegment(id);
    if (result) {
      store.removeSegment(id);
    }
    return result;
  }, [segments, store]);

  const createCustomField = useCallback(async (data: Omit<LeadCustomField, 'id'>): Promise<LeadCustomField | null> => {
    const result = await customFields.createField(data);
    if (result) {
      store.addCustomField(result);
    }
    return result;
  }, [customFields, store]);

  const updateCustomField = useCallback(async (id: number, data: Partial<LeadCustomField>): Promise<LeadCustomField | null> => {
    const result = await customFields.updateField(id, data);
    if (result) {
      store.updateCustomField(id, result);
    }
    return result;
  }, [customFields, store]);

  const deleteCustomField = useCallback(async (id: number): Promise<boolean> => {
    const result = await customFields.deleteField(id);
    if (result) {
      store.removeCustomField(id);
    }
    return result;
  }, [customFields, store]);

  const addActivity = useCallback(async (leadId: number, activity: Omit<LeadActivity, 'id' | 'lead_id' | 'created_at'>): Promise<boolean> => {
    const result = await core.addActivity(leadId, activity);
    return result;
  }, [core]);

  const addNote = useCallback(async (leadId: number, content: string, isPrivate?: boolean): Promise<boolean> => {
    const result = await manager.addNote(leadId, content, isPrivate);
    return result;
  }, [manager]);

  const addTask = useCallback(async (leadId: number, task: Omit<LeadTask, 'id' | 'lead_id' | 'created_at' | 'updated_at'>): Promise<boolean> => {
    const result = await manager.addTask(leadId, task);
    return result;
  }, [manager]);

  const uploadDocument = useCallback(async (leadId: number, file: File): Promise<boolean> => {
    const result = await manager.uploadDocument(leadId, file);
    return result;
  }, [manager]);

  // ========================================
  // RETURN
  // ========================================
  
  return {
    // State from Store
    leads: store.leads,
    currentLead: store.currentLead,
    segments: store.segments,
    tags: store.tags,
    customFields: store.customFields,
    metrics: store.metrics,
    analytics: store.analytics,
    performance: store.performance,
    engagement: store.engagement,
    healthScores: store.healthScores,
    attribution: store.attribution,
    forecasts: store.forecasts,
    sources: store.sources,
    roi: store.roi,
    activities: store.activities,
    notes: store.notes,
    tasks: store.tasks,
    documents: store.documents,
    loading: store.loading,
    error: store.error,
    filters: store.filters,
    pagination: store.pagination,
    projectSettings: store.projectSettings,
    projectActive: store.projectActive,
    
    // Core Actions
    createLead,
    updateLead,
    deleteLead,
    getLead,
    bulkUpdate,
    bulkDelete,
    
    // Manager Actions
    updateStatus: manager.updateStatus,
    updateScore: manager.updateScore,
    assign: manager.assign,
    unassign: manager.unassign,
    duplicate: manager.duplicate,
    merge: manager.merge,
    
    // Segments Actions
    createSegment,
    updateSegment,
    deleteSegment,
    calculateSegment: segments.calculateSegment,
    
    // Analytics Actions
    fetchMetrics: analytics.fetchMetrics,
    fetchAnalytics: analytics.fetchAnalytics,
    fetchPerformance: analytics.fetchPerformance,
    fetchEngagement: analytics.fetchEngagement,
    
    // Custom Fields Actions
    createCustomField,
    updateCustomField,
    deleteCustomField,
    
    // Activities Actions
    addActivity,
    addNote,
    addTask,
    uploadDocument,
    
    // Filters and Search
    setFilters: core.setFilters,
    resetFilters: core.resetFilters,
    searchLeads: core.searchLeads,
    
    // Pagination
    setPage: core.setPage,
    setItemsPerPage: core.setItemsPerPage,
    
    // State Management
    setCurrentLead: core.setCurrentLead,
    clearError: core.clearError,
    refreshLeads: core.refreshLeads,
    
    // Project Management
    checkProject: core.checkProject,
    refreshProjectSettings: core.refreshProjectSettings
  };
};
