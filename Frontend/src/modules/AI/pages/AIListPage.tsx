import React, { useState } from 'react';
import { ModuleLayout, PageHeader } from '@/shared/components/ui';
import { AIMetricsCards, AIFiltersPanel, AITable, AIFormModal } from '../components';
import { useAIRefactored } from '../hooks/useAI';

export const AIListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { generations, loading, metrics, filters, setFilters, refreshGenerations } = useAIRefactored();

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title="Gerações de IA"
        description="Gerencie suas gerações de texto, imagem e análise"
        action={
          label: 'Nova Geração',
          onClick: () => setIsModalOpen(true),
        } />
      
      <AIMetricsCards metrics={metrics} loading={loading} / />
      <AIFiltersPanel 
        filters={ filters }
        onFiltersChange={ setFilters }
        onClear={() => setFilters({})} />
      
      <AITable 
        generations={ generations }
        loading={ loading }
        onRefresh={ refreshGenerations }
      / />
      <AIFormModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) } />
    </ModuleLayout>);};

export default AIListPage;
