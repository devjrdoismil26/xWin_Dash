import React, { useState } from 'react';
import { ModuleLayout, PageHeader } from '@/shared/components/ui';
import { ActivityMetricsCards, ActivityFiltersPanel, ActivityTable, ActivityFormModal } from '../components';
import { useActivityRefactored } from '../hooks/useActivity';

export const ActivityListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    logs, 
    loading, 
    metrics, 
    filters, 
    setFilters, 
    refreshLogs 
  } = useActivityRefactored();

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title="Atividades"
        description="Monitore logs e atividades do sistema"
        action={ label: 'Exportar',
          onClick: () => {
            // TODO: Implement export functionality
            if (import.meta.env.DEV) {
              console.warn('Export activities - not implemented');

             } ,
        } />
      
      <ActivityMetricsCards metrics={metrics} loading={loading} / />
      <ActivityFiltersPanel 
        filters={ filters }
        onFiltersChange={ setFilters }
        onClear={() => setFilters({})} />
      
      <ActivityTable 
        logs={ logs }
        loading={ loading }
        onRefresh={ refreshLogs }
      / />
      <ActivityFormModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) } />
    </ModuleLayout>);};

export default ActivityListPage;
