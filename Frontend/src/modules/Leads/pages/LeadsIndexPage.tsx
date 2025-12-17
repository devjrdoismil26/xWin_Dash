// ========================================
// LEADS INDEX PAGE - PÁGINA PRINCIPAL
// ========================================
// Página principal do módulo Leads com dashboard e lista de leads
// Máximo: 200 linhas

import React, { Suspense, useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import { Users, Plus, Filter, Download, Upload } from 'lucide-react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { LoadingSpinner } from '@/shared/components/ui/LoadingStates';
import { PageTransition } from '@/shared/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/shared/components/ui/ResponsiveSystem';
import { useLeads } from '../hooks/useLeads';
import { ModernLeadCard } from '../LeadsManager/components/ModernLeadCard';
import { VirtualizedLeadList } from '../LeadsManager/components/VirtualizedLeadList';
import { LeadsHeader } from '../components/LeadsHeader';
import { LeadsMetrics } from '../components/LeadsMetrics';
import { LeadsFilters } from '../components/LeadsFilters';
import AdvancedLeadManager from '../LeadsManager/components/AdvancedLeadManager';
import { LeadFormModal } from '../components/LeadFormModal';
import { Lead, LeadFormData } from '../types';
import { toast } from 'sonner';

// ========================================
// INTERFACES
// ========================================

interface LeadsIndexPageProps {
  className?: string;
  initialFilters?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

// ========================================
// COMPONENTES LAZY LOADED
// ========================================

const LeadsDashboard = React.lazy(() => import('../LeadsManager/components/AdvancedLeadManager'));

const LeadsAnalytics = React.lazy(() => import('../LeadsAnalytics/components/ModernLeadAnalytics'));

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export const LeadsIndexPage: React.FC<LeadsIndexPageProps> = ({ className = '',
  initialFilters 
   }) => {
  const {
    leads,
    loading,
    error,
    filters,
    pagination,
    metrics,
    setFilters,
    resetFilters,
    searchLeads,
    setPage,
    setItemsPerPage,
    clearError,
    createLead,
    updateLead,
    deleteLead,
    refresh
  } = useLeads();

  // Estados para modais e seleção
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters({ ...filters, ...newFilters, page: 1 });};

  const handlePageChange = (page: number) => {
    setPage(page);};

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);};

  const handleRefresh = () => {
    searchLeads();};

  const handleCreateLead = useCallback(() => {
    setCreateModalOpen(true);

  }, []);

  const handleEditLead = useCallback((lead: Lead) => {
    setSelectedLead(lead);

    setEditModalOpen(true);

  }, []);

  const handleDeleteLead = useCallback(async (lead: Lead) => {
    if (confirm(`Deseja realmente deletar o lead "${lead.name}"?`)) {
      try {
        await deleteLead(lead.id);

        toast.success('Lead deletado com sucesso');

        await refresh();

      } catch (error) {
        toast.error('Erro ao deletar lead');

      } }, [deleteLead, refresh]);

  const handleSelectLead = useCallback((lead: Lead) => {
    setSelectedLeads(prev => 
      prev.includes(lead.id) 
        ? prev.filter(id => id !== lead.id)
        : [...prev, lead.id]);

  }, []);

  const handleBulkAction = useCallback(async (action: string, ids: string[]) => {
    try {
      switch (action) {
        case 'delete':
          if (confirm(`Deseja deletar ${ids.length} lead(s)?`)) {
            await Promise.all(ids.map(id => deleteLead(id)));

            toast.success(`${ids.length} lead(s) deletado(s) com sucesso`);

            await refresh();

          }
          break;
        case 'export':
          // TODO: Implementar exportação em massa
          toast.info('Exportação em massa será implementada em breve');

          break;
        default:
          toast.warning(`Ação "${action}" não implementada`);

      } catch (error) {
      toast.error('Erro ao executar ação em massa');

    } , [deleteLead, refresh]);

  const handleImport = useCallback(() => {
    // TODO: Implementar importação de leads via CSV/Excel
    toast.info('Importação de leads será implementada em breve');

  }, []);

  const handleExport = useCallback(() => {
    // TODO: Implementar exportação de leads para CSV/Excel
    toast.info('Exportação de leads será implementada em breve');

  }, []);

  const handleCreateLeadSubmit = useCallback(async (data: LeadFormData) => {
    try {
      await createLead(data);

      setCreateModalOpen(false);

      await refresh();

    } catch (error) {
      // Erro já tratado no hook
    } , [createLead, refresh]);

  const handleEditLeadSubmit = useCallback(async (data: LeadFormData) => {
    if (!selectedLead) return;
    try {
      await updateLead(selectedLead.id, data);

      setEditModalOpen(false);

      setSelectedLead(null);

      await refresh();

    } catch (error) {
      // Erro já tratado no hook
    } , [selectedLead, updateLead, refresh]);

  // ========================================
  // RENDER
  // ========================================
  
  return (
        <>
      <PageTransition type="fade" duration={ 500 } />
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className} `}>
           
        </div><Head title="Leads - xWin Dash">
          {/* Header */}
        <LeadsHeader
          title="Gestão de Leads"
          subtitle="Gerencie seus leads de forma eficiente"
          actions={[
            {
              label: 'Novo Lead',
              icon: Plus,
              onClick: handleCreateLead,
              variant: 'primary'
            },
            {
              label: 'Importar',
              icon: Upload,
              onClick: handleImport,
              variant: 'secondary'
            },
            {
              label: 'Exportar',
              icon: Download,
              onClick: handleExport,
              variant: 'secondary'
            }
          ]}
  >
          {/* Main Content */}
        <div className="{/* Metrics Cards */}">$2</div>
          {metrics && (
            <LeadsMetrics
              metrics={ metrics }
              loading={ loading }
              onRefresh={ handleRefresh }
            / />
          )}

          {/* Filters */}
          <Card className="p-6" />
            <LeadsFilters
              filters={ filters }
              onFiltersChange={ handleFilterChange }
              onReset={ resetFilters }
              loading={ loading }
            / />
          </Card>

          {/* Actions Bar */}
          <LeadsActions
            selectedCount={ selectedLeads.length }
            onBulkAction={ handleBulkAction }
            loading={ loading  }>
          {/* Leads List */}
          <Card className="p-6" />
            <Suspense fallback={ <LoadingSpinner size="lg" />  }>
              <LeadsList
                leads={ leads }
                loading={ loading }
                error={ error }
                pagination={ pagination }
                onPageChange={ handlePageChange }
                onItemsPerPageChange={ handleItemsPerPageChange }
                onLeadSelect={ handleSelectLead }
                onLeadEdit={ handleEditLead }
                onLeadDelete={ handleDeleteLead }
              / /></Suspense></Card>

          {/* Analytics Dashboard (Lazy Loaded) */}
          <Suspense fallback={ <Card className="p-6" />
              <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></Card>
  }>
            <LeadsAnalytics
              metrics={ metrics }
              loading={ loading }
              className="mt-6"
            / />
          </Suspense>

          {/* Dashboard (Lazy Loaded) */}
          <Suspense fallback={ <Card className="p-6" />
              <div className=" ">$2</div><LoadingSpinner size="lg" / /></div></Card>
  }>
            <LeadsDashboard
              leads={ leads }
              metrics={ metrics }
              loading={ loading }
              className="mt-6"
            / /></Suspense></div>

        {/* Modals */}
        {createModalOpen && (
          <LeadFormModal
            open={ createModalOpen }
            onClose={ () => setCreateModalOpen(false) }
            onSubmit={ handleCreateLeadSubmit } />
        )}

        {editModalOpen && selectedLead && (
          <LeadFormModal
            open={ editModalOpen }
            lead={ selectedLead }
            onClose={() => {
              setEditModalOpen(false);

              setSelectedLead(null);

            } onSubmit={ handleEditLeadSubmit } />
        )}
      </div>
    </PageTransition>);};

export default LeadsIndexPage;
