/**
 * @module modules/Dashboard/components/widgets/CalendarIntegrationWidget
 * @description
 * Widget de integração com calendário.
 * 
 * Exibe métricas de eventos e atividades do calendário:
 * - Total de eventos
 * - Eventos próximos
 * - Eventos concluídos
 * - Eventos cancelados
 * 
 * @example
 * ```typescript
 * <CalendarIntegrationWidget
 *   data={
 *     totalEvents: 200,
 *     upcomingEvents: 50,
 *     completedEvents: 140,
 *     cancelledEvents: 10
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { CalendarIntegrationData, WidgetProps } from '@/types';

/**
 * Props do widget de integração com calendário
 * @interface CalendarIntegrationWidgetProps
 * @extends WidgetProps
 */
interface CalendarIntegrationWidgetProps extends WidgetProps {
  /** Dados de integração com calendário */
  data?: CalendarIntegrationData;
}

/**
 * Componente widget de integração com calendário
 * @param {CalendarIntegrationWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de integração com calendário
 */
const CalendarIntegrationWidget: React.FC<CalendarIntegrationWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Integração Calendário</Card.Title>
        </Card.Header>
        <Card.Content className="p-4" />
          <div className="animate-pulse">Carregando...</div>
        </Card.Content>
      </Card>);

  }
  if (error) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Integração Calendário</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Integração Calendário</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Total de Eventos: {(data.totalEvents || 0).toLocaleString('pt-BR')}</div>
          <div className="text-blue-600">Próximos: {(data.upcomingEvents || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Concluídos: {(data.completedEvents || 0).toLocaleString('pt-BR')}</div>
          {data.cancelledEvents && (
            <div className="text-red-600">Cancelados: {data.cancelledEvents.toLocaleString('pt-BR')}</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default CalendarIntegrationWidget;
