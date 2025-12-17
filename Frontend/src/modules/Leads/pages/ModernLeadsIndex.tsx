import React, { useState, useEffect, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import AppLayout from '@/layouts/AppLayout';
import { useLeads } from '../hooks/useLeads';
import { Lead, LeadFormData } from '../types';
import ModernLeadFilters from '../LeadsManager/components/ModernLeadFilters';
import ModernLeadAnalytics from '../LeadsAnalytics/components/ModernLeadAnalytics';
import { LeadsPageHeader, LeadsSearchBar, LeadsViewControls, LeadsGridView, LeadsListView, LeadsEmptyState, ViewMode } from './Modern';

interface ModernLeadsIndexProps {
  initialLeads?: Lead[];
  initialMetrics?: string;
  initialAnalytics?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ModernLeadsIndex: React.FC<ModernLeadsIndexProps> = ({ initialLeads = [],
  initialMetrics = null,
  initialAnalytics = null
   }) => {
  const {
    leads,
    metrics,
    analytics,
    loading,
    error,
    filters,
    isEmpty,
    createLead,
    updateLead,
    deleteLead,
    fetchLeads,
    refreshLeads,
    exportLeads,
    updateLeadScore,
    updateLeadStatus,
    applyFilters,
    clearFilters,
    searchLeads,
    fetchAnalytics,
    fetchMetrics,
    setCurrentLead
  } = useLeads();

  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showImportModal, setShowImportModal] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

  const [selectedLeads, setSelectedLeads] = useState<Set<number>>(new Set());

  const [searchTerm, setSearchTerm] = useState('');

  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const [viewingLead, setViewingLead] = useState<Lead | null>(null);

  useEffect(() => {
    if (initialLeads.length === 0) {
      fetchLeads();

      fetchMetrics();

      fetchAnalytics();

    } , []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.search) {
        searchLeads(searchTerm);

      } , 300);

    return () => clearTimeout(timer);

  }, [searchTerm, filters.search, searchLeads]);

  const handleCreateLead = useCallback(async (data: LeadFormData) => {
    const lead = await createLead(data);

    if (lead) {
      setShowCreateModal(false);

    } , [createLead]);

  const handleUpdateLead = useCallback(async (id: number, data: Partial<LeadFormData>) => {
    const lead = await updateLead(id, data);

    if (lead) {
      setEditingLead(null);

    } , [updateLead]);

  const handleDeleteLead = useCallback(async (lead: Lead) => {
    if (window.confirm(`Tem certeza que deseja remover o lead "${lead.name}"?`)) {
      const success = await deleteLead(lead.id);

      if (success) {
        setSelectedLeads(prev => {
          const newSet = new Set(prev);

          newSet.delete(lead.id);

          return newSet;
        });

      } }, [deleteLead]);

  const handleViewLead = useCallback((lead: Lead) => {
    setViewingLead(lead);

    setCurrentLead(lead);

  }, [setCurrentLead]);

  const handleEditLead = useCallback((lead: Lead) => {
    setEditingLead(lead);

  }, []);

  const handleUpdateScore = useCallback(async (lead: Lead, score: number) => {
    await updateLeadScore(lead.id, score, 'Atualização manual');

  }, [updateLeadScore]);

  const handleUpdateStatus = useCallback(async (lead: Lead, status: string) => {
    await updateLeadStatus(lead.id, status, 'Atualização manual');

  }, [updateLeadStatus]);

  const handleSelectLead = useCallback((leadId: number, selected: boolean) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);

      if (selected) {
        newSet.add(leadId);

      } else {
        newSet.delete(leadId);

      }
      return newSet;
    });

  }, []);

  const handleBulkExport = useCallback(async () => {
    await exportLeads({ format: 'csv', filters });

  }, [exportLeads, filters]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedLeads.size === 0) return;
    
    if (window.confirm(`Tem certeza que deseja remover ${selectedLeads.size} leads?`)) {
      for (const leadId of selectedLeads) {
        await deleteLead(leadId);

      }
      setSelectedLeads(new Set());

    } , [selectedLeads, deleteLead]);

  const handleRefresh = useCallback(() => {
    refreshLeads();

    fetchMetrics();

    fetchAnalytics();

  }, [refreshLeads, fetchMetrics, fetchAnalytics]);

  const hasFilters = Object.keys(filters).length > 0 || searchTerm.length > 0;

  return (
        <>
      <AppLayout />
      <Head title="Leads - CRM" / />
      <div className=" ">$2</div><LeadsPageHeader
          onCreateLead={ () => setShowCreateModal(true) }
          onExport={ handleBulkExport }
          onImport={ () => setShowImportModal(true) }
          onRefresh={ handleRefresh }
          loading={ loading } />

        <LeadsSearchBar
          searchTerm={ searchTerm }
          onSearchChange={ setSearchTerm }
          showFilters={ showFilters }
          onToggleFilters={ () => setShowFilters(!showFilters) }
          resultsCount={ leads?.length } />

        {showFilters && (
          <Card className="p-4" />
            <ModernLeadFilters
              filters={ filters }
              onApplyFilters={ applyFilters }
              onClearFilters={ clearFilters }
            / />
          </Card>
        )}

        <LeadsViewControls
          viewMode={ viewMode }
          onViewModeChange={ setViewMode }
          selectedCount={ selectedLeads.size }
          onBulkExport={ handleBulkExport }
          onBulkDelete={ handleBulkDelete  }>
          {loading && (
          <div className=" ">$2</div><RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Carregando leads...</span>
      </div>
    </>
  )}

        {error && (
          <Card className="p-4 border-red-200 bg-red-50" />
            <div className=" ">$2</div><AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{error}</span></div></Card>
        )}

        {!loading && !error && (
          <>
            {viewMode === 'analytics' ? (
              <ModernLeadAnalytics
                analytics={ analytics }
                metrics={ metrics }
                onRefresh={ handleRefresh }
              / />
            ) : isEmpty ? (
              <LeadsEmptyState
                onCreateLead={ () => setShowCreateModal(true) }
                hasFilters={ hasFilters }
                onClearFilters={ clearFilters } />
            ) : viewMode === 'grid' ? (
              <LeadsGridView
                leads={ leads || [] }
                selectedLeads={ selectedLeads }
                onSelectLead={ handleSelectLead }
                onViewLead={ handleViewLead }
                onEditLead={ handleEditLead }
                onDeleteLead={ handleDeleteLead }
                onUpdateScore={ handleUpdateScore }
                onUpdateStatus={ handleUpdateStatus }
              / />
            ) : (
              <LeadsListView
                leads={ leads || [] }
                selectedLeads={ selectedLeads }
                onSelectLead={ handleSelectLead }
                onViewLead={ handleViewLead }
                onEditLead={ handleEditLead }
                onDeleteLead={ handleDeleteLead }
              / />
            )}
          </>
        )}
      </div>
    </AppLayout>);};

export default ModernLeadsIndex;
