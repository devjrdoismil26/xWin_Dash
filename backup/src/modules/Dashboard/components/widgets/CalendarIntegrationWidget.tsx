import React from 'react';
import Card from '@/components/ui/Card';
import { CalendarIntegrationData, WidgetProps } from '../../types';
interface CalendarIntegrationWidgetProps extends WidgetProps {
  data?: CalendarIntegrationData;
}
const CalendarIntegrationWidget: React.FC<CalendarIntegrationWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Integração Calendário</Card.Title>
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
          <Card.Title>Integração Calendário</Card.Title>
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
        <Card.Title>Integração Calendário</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Total de Eventos: {(data.totalEvents || 0).toLocaleString('pt-BR')}</div>
          <div className="text-blue-600">Próximos: {(data.upcomingEvents || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Concluídos: {(data.completedEvents || 0).toLocaleString('pt-BR')}</div>
          {data.cancelledEvents && (
            <div className="text-red-600">Cancelados: {data.cancelledEvents.toLocaleString('pt-BR')}</div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default CalendarIntegrationWidget;
