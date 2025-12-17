import React from 'react';
import { Head } from '@inertiajs/react';
import { Users, Plus, Filter, Download } from 'lucide-react';
import { ModuleLayout, PageHeader, Card, Button } from '@/shared/components/ui';
import { useLeads } from '../hooks/useLeads';
import { LeadsMetrics } from '../components/LeadsMetrics';
import { LeadsFilters } from '../components/LeadsFilters';
import { VirtualizedLeadList } from '../LeadsManager/components/VirtualizedLeadList';

const MENU_ITEMS = [
  { icon: <Users size={20 } />, label: 'Todos os Leads', path: '/leads' },
  { icon: <Filter size={20 } />, label: 'Segmentos', path: '/leads/segments' },
  { icon: <Download size={20 } />, label: 'Analytics', path: '/leads/analytics' }
];

export const LeadsIndexPage: React.FC = () => {
  const { leads, loading, filters, setFilters } = useLeads();

  return (
            <>
      <Head title="Leads" / />
      <ModuleLayout
        moduleTitle="Leads"
        moduleIcon={ <Users size={24 } />}
        menuItems={ MENU_ITEMS  }>
        <PageHeader
          title="Gerenciamento de Leads"
          subtitle={`${leads.length} leads cadastrados`}
          actions={
    <Button variant="primary" size="md" />
              <Plus size={16} className="mr-2" />
              Novo Lead
            </Button>
  } />

        <div className=" ">$2</div><LeadsMetrics / />
          <Card title="Filtros" />
            <LeadsFilters filters={filters} onChange={setFilters} / /></Card><Card title="Lista de Leads" />
            {loading ? (
              <div className="flex justify-center py-8">Carregando...</div>
            ) : (
              <VirtualizedLeadList leads={leads} / />
            )}
          </Card></div></ModuleLayout>
    </>);};
