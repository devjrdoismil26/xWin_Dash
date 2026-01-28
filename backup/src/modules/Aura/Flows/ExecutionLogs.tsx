import React from 'react';
import Card from '@/components/ui/Card';
const ExecutionLogs: React.FC<{ logs?: Array<{ id: string | number; message: string; created_at?: string }> }> = ({ logs = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Logs de Execução</Card.Title>
    </Card.Header>
    <Card.Content className="p-0">
      <ul className="divide-y">
        {logs.map((l) => (
          <li key={l.id} className="p-3 text-sm">
            <div className="flex items-center justify-between">
              <span>{l.message}</span>
              <span className="text-xs text-gray-500">{l.created_at ? new Date(l.created_at).toLocaleString('pt-BR') : '-'}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card.Content>
  </Card>
);
export default ExecutionLogs;
