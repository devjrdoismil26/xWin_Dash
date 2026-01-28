// ========================================
// LEADS INDEX PAGE - PÁGINA PRINCIPAL
// ========================================
// Página principal do módulo Leads com dashboard e lista de leads
// Máximo: 200 linhas

import React, { Suspense } from 'react';
import { Head } from '@inertiajs/react';
import { Users, Plus, Filter, Download, Upload } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingStates';
import { PageTransition } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';
import { useLeads } from '../hooks/useLeads';
import { ModernLeadCard } from '../LeadsManager/components/ModernLeadCard';
import { VirtualizedLeadList } from '../LeadsManager/components/VirtualizedLeadList';
import { LeadsHeader } from '../components/LeadsHeader';
import { LeadsMetrics } from '../components/LeadsMetrics';
import { LeadsFilters } from '../components/LeadsFilters';
import AdvancedLeadManager from '../LeadsManager/components/AdvancedLeadManager';

// ========================================
// INTERFACES
// ========================================

interface LeadsIndexPageProps {
  className?: string;
  initialFilters?: any;
}

// ========================================
// COMPONENTES LAZY LOADED
// ========================================

const LeadsDashboard = React.lazy(() => import('../LeadsManager/components/AdvancedLeadManager'));
const LeadsAnalytics = React.lazy(() => import('../LeadsAnalytics/components/ModernLeadAnalytics'));

// ========================================
// COMPONENTE PRINCIPAL
// ========================================

export const LeadsIndexPage: React.FC<LeadsIndexPageProps> = ({ 
  className = '',
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
    clearError
  } = useLeads();

  // ========================================
  // HANDLERS
  // ========================================
  
  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setItemsPerPage(itemsPerPage);
  };

  const handleRefresh = () => {
    searchLeads();
  };

  // ========================================
  // RENDER
  // ========================================
  
  return (
    <PageTransition type="fade" duration={500}>
      <div className={`min-h-screen bg-gradient-to-br from-blue-50/50 via-white/30 to-purple-50/50 dark:from-gray-900/50 dark:via-gray-800/30 dark:to-gray-900/50 backdrop-blur-xl ${className}`}>
        <Head title="Leads - xWin Dash" />
        
        {/* Header */}
        <LeadsHeader
          title="Gestão de Leads"
          subtitle="Gerencie seus leads de forma eficiente"
          actions={[
            {
              label: 'Novo Lead',
              icon: Plus,
              onClick: () => console.log('Criar novo lead'),
              variant: 'primary'
            },
            {
              label: 'Importar',
              icon: Upload,
              onClick: () => console.log('Importar leads'),
              variant: 'secondary'
            },
            {
              label: 'Exportar',
              icon: Download,
              onClick: () => console.log('Exportar leads'),
              variant: 'secondary'
            }
          ]}
        />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 space-y-6">
          
          {/* Metrics Cards */}
          {metrics && (
            <LeadsMetrics
              metrics={metrics}
              loading={loading}
              onRefresh={handleRefresh}
            />
          )}

          {/* Filters */}
          <Card className="p-6">
            <LeadsFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
              onReset={resetFilters}
              loading={loading}
            />
          </Card>

          {/* Actions Bar */}
          <LeadsActions
            selectedCount={0}
            onBulkAction={(action, ids) => console.log('Bulk action:', action, ids)}
            loading={loading}
          />

          {/* Leads List */}
          <Card className="p-6">
            <Suspense fallback={<LoadingSpinner size="lg" />}>
              <LeadsList
                leads={leads}
                loading={loading}
                error={error}
                pagination={pagination}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                onLeadSelect={(lead) => console.log('Lead selected:', lead)}
                onLeadEdit={(lead) => console.log('Edit lead:', lead)}
                onLeadDelete={(lead) => console.log('Delete lead:', lead)}
              />
            </Suspense>
          </Card>

          {/* Analytics Dashboard (Lazy Loaded) */}
          <Suspense fallback={
            <Card className="p-6">
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            </Card>
          }>
            <LeadsAnalytics
              metrics={metrics}
              loading={loading}
              className="mt-6"
            />
          </Suspense>

          {/* Dashboard (Lazy Loaded) */}
          <Suspense fallback={
            <Card className="p-6">
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
              </div>
            </Card>
          }>
            <LeadsDashboard
              leads={leads}
              metrics={metrics}
              loading={loading}
              className="mt-6"
            />
          </Suspense>
        </div>
      </div>
    </PageTransition>
  );
};

export default LeadsIndexPage;
