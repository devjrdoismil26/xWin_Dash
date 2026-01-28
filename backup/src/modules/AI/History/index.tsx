import React, { useMemo, useState, useCallback } from 'react';
import { Head, router } from '@inertiajs/react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import AIHistoryFilters from './components/AIHistoryFilters.tsx';
import AIHistoryTable from './components/AIHistoryTable.tsx';
const AIHistory: React.FC<{ history?: Record<string, unknown>; filters?: Record<string, unknown> }> = ({ history = { data: [], last_page: 1 }, filters = {} }) => {
  const [filterValues, setFilterValues] = useState({ type: filters.type || '', date: filters.date || '', sort: filters.sort || 'created_at', direction: filters.direction || 'desc' });
  const [selectedRequest, setSelectedRequest] = useState<Record<string, unknown> | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<Record<string, unknown> | null>(null);
  const [processing, setProcessing] = useState(false);
  const applyFilters = useCallback(() => {
    router.get('/ai/history', filterValues as Record<string, unknown>);
  }, [filterValues]);
  const clearFilters = useCallback(() => {
    const cleared = { type: '', date: '', sort: 'created_at', direction: 'desc' };
    setFilterValues(cleared);
    router.get('/ai/history', cleared as Record<string, unknown>);
  }, []);
  return (
    <PageLayout>
      <Head title="Histórico de IA" />
      <Card>
        <div className="p-4 space-y-3">
          <h2 className="text-lg font-semibold">Solicitações à IA</h2>
          <p className="text-sm text-gray-600">Visualize e gerencie as solicitações feitas às ferramentas de IA.</p>
          <AIHistoryFilters filterValues={filterValues} onFilterChange={(k: string, v: string) => setFilterValues((p) => ({ ...p, [k]: v }))} onApplyFilters={applyFilters} onClearFilters={clearFilters} />
          {history.data.length === 0 ? (
            <div>Nenhum registro de histórico encontrado.</div>
          ) : (
            <AIHistoryTable history={history.data} onAction={(action: string, row: Record<string, unknown>) => (action === 'view' ? setSelectedRequest(row) : setRequestToDelete(row))} filterValues={filterValues} />
          )}
        </div>
      </Card>
      <Modal open={!!selectedRequest} onClose={() => setSelectedRequest(null)}>
        {selectedRequest && <pre className="p-4 text-xs overflow-auto">{JSON.stringify(selectedRequest, null, 2)}</pre>}
      </Modal>
      <ConfirmationModal open={!!requestToDelete} onClose={() => setRequestToDelete(null)} onConfirm={() => setProcessing(false)} loading={processing} />
    </PageLayout>
  );
};
export default AIHistory;
