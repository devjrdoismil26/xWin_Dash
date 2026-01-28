import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Table } from '@/components/ui/Table';
interface HistoryItem {
  id: string;
  type: string;
  provider?: string;
  status?: string;
  tokens?: number;
  cost?: number;
  created_at?: string;
}
const EnhancedAIHistory: React.FC<{ historyItems?: HistoryItem[]; className?: string }> = ({ historyItems = [], className = '' }) => {
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const columns = useMemo(
    () => [
      { key: 'type', label: 'Tipo' },
      { key: 'provider', label: 'Provider' },
      { key: 'status', label: 'Status' },
      { key: 'tokens', label: 'Tokens' },
      { key: 'cost', label: 'Custo' },
      { key: 'created_at', label: 'Data' },
    ],
    [],
  );
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-3">
        <Button size="sm" variant={viewMode === 'table' ? 'default' : 'ghost'} onClick={() => setViewMode('table')}>Tabela</Button>
        <Button size="sm" variant={viewMode === 'cards' ? 'default' : 'ghost'} onClick={() => setViewMode('cards')}>Cards</Button>
      </div>
      {viewMode === 'table' ? (
        <Card>
          <Card.Content className="p-0">
            <Table columns={columns as any} data={historyItems as any} emptyMessage="Sem registros" />
          </Card.Content>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {historyItems.map((item) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{item.type}</Badge>
                <span className="text-xs text-gray-500">{new Date(item.created_at || '').toLocaleString('pt-BR')}</span>
              </div>
              <div className="text-sm text-gray-700">{item.provider} • {item.status}</div>
              <div className="text-xs text-gray-500 mt-2">Tokens: {item.tokens} • Custo: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.cost || 0)}</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
export default EnhancedAIHistory;
