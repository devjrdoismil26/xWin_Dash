// ========================================
// LEADS HOOK - ORQUESTRADOR PRINCIPAL
// ========================================
// Hook principal que orquestra todos os hooks especializados
// Máximo: 200 linhas

import { useMemo } from 'react';
import { useLeadsCore } from '../LeadsCore/hooks/useLeadsCore';
import { useLeadsManager } from '../LeadsManager/hooks/useLeadsManager';
import { useLeadsSegments } from '../LeadsSegments/hooks/useLeadsSegments';
import { useLeadsAnalytics } from '../LeadsAnalytics/hooks/useLeadsAnalytics';
import { useLeadsCustomFields } from '../LeadsCustomFields/hooks/useLeadsCustomFields';
import { Lead, LeadFilters, LeadFormData, LeadMetrics, LeadAnalytics, LeadExportOptions, LeadImportResult } from '../types';

export const useLeadsOrchestrator = () => {
  // Hooks especializados
  const coreHook = useLeadsCore();

  const managerHook = useLeadsManager();

  const segmentsHook = useLeadsSegments();

  const analyticsHook = useLeadsAnalytics();

  const customFieldsHook = useLeadsCustomFields();

  // Computed values consolidados
  const computedValues = useMemo(() => {
    return {
      isEmpty: coreHook.leads.length === 0,
      hasError: !!coreHook.error,
      isLoading: coreHook.loading,
      totalPages: coreHook.pagination.last_page,
      currentPage: coreHook.pagination.current_page,
      total: coreHook.pagination.total,
      hasNextPage: coreHook.pagination.current_page < coreHook.pagination.last_page,
      hasPrevPage: coreHook.pagination.current_page > 1,
      filteredLeads: coreHook.leads.filter(lead => {
        if (coreHook.filters.search) {
          const searchLower = coreHook.filters.search.toLowerCase();

          const matchesSearch = 
            lead.name.toLowerCase().includes(searchLower) ||
            lead.email.toLowerCase().includes(searchLower) ||
            lead.company?.toLowerCase().includes(searchLower) ||
            lead.notes?.toLowerCase().includes(searchLower);

          if (!matchesSearch) return false;
        }

        if (coreHook.filters.status && coreHook.filters.status.length > 0) {
          if (!coreHook.filters.status.includes(lead.status)) return false;
        }

        if (coreHook.filters.origin && coreHook.filters.origin.length > 0) {
          if (!coreHook.filters.origin.includes(lead.origin)) return false;
        }

        if (coreHook.filters.tags && coreHook.filters.tags.length > 0) {
          const leadTags = lead.tags.map(tag => tag.name);

          const hasMatchingTag = coreHook.filters.tags.some(tag => leadTags.includes(tag));

          if (!hasMatchingTag) return false;
        }

        return true;
      })};

  }, [coreHook.leads, coreHook.filters, coreHook.pagination, coreHook.loading, coreHook.error]);

  // Ações consolidadas
  const actions = useMemo(() => ({
    // Core actions
    createLead: coreHook.createLead,
    updateLead: coreHook.updateLead,
    deleteLead: coreHook.deleteLead,
    getLead: coreHook.getLead,
    fetchLeads: coreHook.fetchLeads,
    refreshLeads: coreHook.refreshLeads,
    exportLeads: coreHook.exportLeads,
    importLeads: coreHook.importLeads,
    applyFilters: coreHook.applyFilters,
    clearFilters: coreHook.clearFilters,
    searchLeads: coreHook.searchLeads,
    goToPage: coreHook.goToPage,
    nextPage: coreHook.nextPage,
    prevPage: coreHook.prevPage,
    setCurrentLead: coreHook.setCurrentLead,
    clearError: coreHook.clearError,
    reset: coreHook.reset,

    // Manager actions
    updateLeadScore: managerHook.updateLeadScore,
    updateLeadStatus: managerHook.updateLeadStatus,
    updateLeadTags: managerHook.updateLeadTags,
    recordActivity: managerHook.recordActivity,
    assignLead: managerHook.assignLead,
    duplicateLead: managerHook.duplicateLead,
    mergeLeads: managerHook.mergeLeads,

    // Segments actions
    createSegment: segmentsHook.createSegment,
    updateSegment: segmentsHook.updateSegment,
    deleteSegment: segmentsHook.deleteSegment,
    fetchSegments: segmentsHook.fetchSegments,

    // Analytics actions
    fetchAnalytics: analyticsHook.fetchAnalytics,
    fetchMetrics: analyticsHook.fetchMetrics,

    // Custom fields actions
    createCustomField: customFieldsHook.createCustomField,
    updateCustomField: customFieldsHook.updateCustomField,
    deleteCustomField: customFieldsHook.deleteCustomField,
    fetchCustomFields: customFieldsHook.fetchCustomFields
  }), [coreHook, managerHook, segmentsHook, analyticsHook, customFieldsHook]);

  return {
    // State consolidado
    leads: coreHook.leads,
    currentLead: coreHook.currentLead,
    segments: segmentsHook.segments,
    tags: coreHook.tags,
    metrics: analyticsHook.metrics,
    analytics: analyticsHook.analytics,
    customFields: customFieldsHook.customFields,
    loading: coreHook.loading || managerHook.loading || segmentsHook.loading || analyticsHook.loading || customFieldsHook.loading,
    error: coreHook.error || managerHook.error || segmentsHook.error || analyticsHook.error || customFieldsHook.error,
    pagination: coreHook.pagination,
    filters: coreHook.filters,

    // Computed values
    ...computedValues,

    // Actions
    ...actions};
};

export default useLeadsOrchestrator;
