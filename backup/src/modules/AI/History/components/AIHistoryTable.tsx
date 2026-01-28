import React from 'react';
import { Eye, Trash2 } from 'lucide-react';
import { Table } from '@/components/ui/Table';
const AIHistoryTable = React.memo(function AIHistoryTable({ history = [], onAction = () => {}, onSort = () => {}, filterValues = {} }) {
  const columns = [
    { key: 'type', label: 'Tipo', render: (row) => (row.type || '').replace('_', ' ') },
    { key: 'prompt', label: 'Prompt', render: (row) => <span className="max-w-xs truncate block">{row.prompt?.content || '-'}</span> },
    { key: 'status', label: 'Status', render: (row) => <span>{row.status}</span> },
    { key: 'created_at', label: 'Data', render: (row) => new Date(row.created_at).toLocaleString('pt-BR') },
    {
      key: 'actions',
      label: 'Ações',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button className="text-blue-600 text-sm" onClick={() => onAction('view', row)}><Eye className="w-4 h-4 inline" /> Visualizar</button>
          <button className="text-red-600 text-sm" onClick={() => onAction('delete', row)}><Trash2 className="w-4 h-4 inline" /> Excluir</button>
        </div>
      ),
    },
  ];
  return (
    <Table columns={columns} data={history} emptyMessage="Nenhum item encontrado" />
  );
});
export default AIHistoryTable;
