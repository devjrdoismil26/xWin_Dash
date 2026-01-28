import React, { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
export default function ActivityList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const activities = useMemo(() => [
    { id: 1, user: 'João Silva', action: 'Login', description: 'Usuário fez login', timestamp: '2024-01-15T10:30:00Z', type: 'success', ip_address: '192.168.1.100', user_agent: 'Mozilla/5.0' },
    { id: 2, user: 'Maria Santos', action: 'Configuração', description: 'Alterou configurações', timestamp: '2024-01-15T10:25:00Z', type: 'info', ip_address: '192.168.1.101', user_agent: 'Mozilla/5.0' },
  ], []);
  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = [activity.user, activity.action, activity.description]
      .join(' ')?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || activity.type === filterType;
    return matchesSearch && matchesFilter;
  });
  return (
    <div className="py-6">
      <Card>
        <Card.Header>
          <Card.Title className="flex items-center justify-between">
            <span>Lista de Atividades</span>
            <Badge variant="secondary">{filteredActivities.length} itens</Badge>
          </Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="flex gap-3 mb-4">
            <Input placeholder="Buscar" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 border rounded">
              <option value="all">Todos</option>
              <option value="success">Sucesso</option>
              <option value="error">Erro</option>
              <option value="warning">Aviso</option>
              <option value="info">Info</option>
            </select>
          </div>
          <ul className="divide-y">
            {filteredActivities.map((activity) => (
              <li key={activity.id} className="py-3">
                <div className="font-medium">{activity.user} — {activity.action}</div>
                <div className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString('pt-BR')}</div>
                <div className="text-sm text-gray-600 mt-1">{activity.description}</div>
                <div className="text-xs text-gray-400 mt-1">{activity.ip_address} — {activity.user_agent}</div>
              </li>
            ))}
            {filteredActivities.length === 0 && <li className="py-6 text-center text-gray-500">Nenhuma atividade</li>}
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
}
