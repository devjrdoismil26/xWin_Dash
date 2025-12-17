import React, { useMemo, useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
import Modal from '@/shared/components/ui/Modal';
import ConfirmationModal from '@/shared/components/ui/ConfirmationModal';
import AIHistoryFilters from './components/AIHistoryFilters';
import AIHistoryTable from './components/AIHistoryTable';
const AIHistory: React.FC<{ history?: Record<string, any>; filters?: Record<string, any> }> = ({ history = { data: [], last_page: 1 }, filters = {} as any }) => {
  const [filterValues, setFilterValues] = useState({ type: filters.type || '', date: filters.date || '', sort: filters.sort || 'created_at', direction: filters.direction || 'desc' });

  const [selectedRequest, setSelectedRequest] = useState<Record<string, any> | null>(null);

  const [requestToDelete, setRequestToDelete] = useState<Record<string, any> | null>(null);

  const [processing, setProcessing] = useState(false);

  const applyFilters = useCallback(() => {
    router.get('/ai/history', filterValues as Record<string, any>);

  }, [filterValues]);

  const clearFilters = useCallback(() => {
    const cleared = { type: '', date: '', sort: 'created_at', direction: 'desc'};

    setFilterValues(cleared);

    router.get('/ai/history', cleared as Record<string, any>);

  }, []);

  return (
        <>
      <PageLayout />
      <Head title="Histórico de IA" / />
      <Card />
        <div className=" ">$2</div><h2 className="text-lg font-semibold">Solicitações à IA</h2>
          <p className="text-sm text-gray-600">Visualize e gerencie as solicitações feitas às ferramentas de IA.</p>
          <AIHistoryFilters filterValues={filterValues} onFilterChange={(k: string, v: string) => setFilterValues((p: unknown) => ({ ...p, [k]: v }))} onApplyFilters={applyFilters} onClearFilters={ clearFilters } />
          {(history.data as unknown[]).length === 0 ? (
            <div>Nenhum registro de histórico encontrado.</div>
          ) : (
            <AIHistoryTable history={history.data} onAction={(action: string, row: Record<string, any>) => (action === 'view' ? setSelectedRequest(row) : setRequestToDelete(row))} filterValues={ filterValues } />
          )}
        </div></Card><Modal isOpen={!!selectedRequest} onClose={ () => setSelectedRequest(null)  }>
        {selectedRequest && <pre className="p-4 text-xs overflow-auto">{JSON.stringify(selectedRequest, null, 2)}</pre>}
      </Modal>
      <ConfirmationModal isOpen={!!requestToDelete} onClose={() => setRequestToDelete(null)} onConfirm={() => setProcessing(false)} loading={ processing } />
    </PageLayout>);};

export default AIHistory;
