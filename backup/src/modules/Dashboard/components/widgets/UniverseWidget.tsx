import React from 'react';
import Card from '@/components/ui/Card';
import { UniverseData, WidgetProps } from '../../types';
interface UniverseWidgetProps extends WidgetProps {
  data?: UniverseData;
}
const UniverseWidget: React.FC<UniverseWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Universe</Card.Title>
        </Card.Header>
        <Card.Content className="p-4">
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>
    );
  }
  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Universe</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  return (
    <Card>
      <Card.Header>
        <Card.Title>Universe</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Total de Usuários: {(data.totalUsers || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Usuários Ativos: {(data.activeUsers || 0).toLocaleString('pt-BR')}</div>
          <div className="text-blue-600">Novos Usuários: {(data.newUsers || 0).toLocaleString('pt-BR')}</div>
          {data.retention && (
            <div>Retenção: {data.retention.toFixed(1)}%</div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default UniverseWidget;
