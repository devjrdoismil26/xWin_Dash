import React, { useState } from 'react';
import { ModuleLayout, PageHeader } from '@/shared/components/ui';
import { ADSToolMetricsCards, ADSToolFiltersPanel, ADSToolTable, ADSToolFormModal } from '../components';
import { useADSToolRefactored } from '../hooks/useADSTool';

export const ADSToolListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { campaigns, loading, metrics, filters, setFilters, refreshCampaigns } = useADSToolRefactored();

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title="Campanhas de Anúncios"
        description="Gerencie suas campanhas Google Ads e LinkedIn Ads"
        action={
          label: 'Nova Campanha',
          onClick: () => setIsModalOpen(true),
        } />
      
      <ADSToolMetricsCards metrics={metrics} loading={loading} / />
      <ADSToolFiltersPanel 
        filters={ filters }
        onFiltersChange={ setFilters }
        onClear={() => setFilters({})} />
      
      <ADSToolTable 
        campaigns={ campaigns }
        loading={ loading }
        onRefresh={ refreshCampaigns }
      / />
      <ADSToolFormModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) } />
    </ModuleLayout>);};

export default ADSToolListPage;
