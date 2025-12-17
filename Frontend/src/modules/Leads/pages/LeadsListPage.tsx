import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Plus, Download, Upload, Filter } from 'lucide-react';
import { ModuleLayout, PageHeader, Card, Button } from '@/shared/components/ui';
import { useLeads } from '../hooks/useLeads';
import { LeadsTable } from '../components/LeadsTable';
import { LeadsMetricsCards } from '../components/LeadsMetricsCards';
import { LeadsFiltersPanel } from '../components/LeadsFiltersPanel';
import { LeadFormModal } from '../components/LeadFormModal';

export const LeadsListPage: React.FC = () => {
  const { leads, metrics, loading, filters, setFilters, createLead, refreshLeads } = useLeads();

  const [showFilters, setShowFilters] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
            <>
      <Head title="Leads - xWin Dash" / />
      <ModuleLayout
        moduleTitle="Leads"
        moduleIcon="users"
        menuItems={[
          { label: 'Lista', path: '/leads', icon: 'list' },
          { label: 'Analytics', path: '/leads/analytics', icon: 'chart' },
          { label: 'Segmentos', path: '/leads/segments', icon: 'filter' },
          { label: 'Campos', path: '/leads/custom-fields', icon: 'settings' }
        ]} />
        <PageHeader
          title="Gestão de Leads"
          subtitle={`${metrics?.total || 0} leads cadastrados`}
          actions={ [
            <Button key="filter" variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)  }>
              <Filter className="w-4 h-4" />
              Filtros
            </Button>,
            <Button key="import" variant="secondary" size="sm" />
              <Upload className="w-4 h-4" />
              Importar
            </Button>,
            <Button key="export" variant="secondary" size="sm" />
              <Download className="w-4 h-4" />
              Exportar
            </Button>,
            <Button key="create" variant="primary" size="sm" onClick={ () => setShowCreateModal(true)  }>
              <Plus className="w-4 h-4" />
              Novo Lead
            </Button>
          ]} />

        <LeadsMetricsCards metrics={metrics} loading={ loading  }>
          {showFilters && (
          <Card title="Filtros" />
            <LeadsFiltersPanel filters={filters} onChange={setFilters} / />
          </Card>
        )}

        <Card />
          <LeadsTable leads={leads} loading={loading} onRefresh={refreshLeads} / /></Card></ModuleLayout>

      <LeadFormModal
        open={ showCreateModal }
        onClose={ () => setShowCreateModal(false) }
        onSubmit={ createLead } />
    </>);};
