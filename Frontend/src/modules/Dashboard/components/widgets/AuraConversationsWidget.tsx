/**
 * @module modules/Dashboard/components/widgets/AuraConversationsWidget
 * @description
 * Widget de conversas do módulo Aura.
 * 
 * Exibe métricas de conversas e atendimento do Aura:
 * - Total de conversas
 * - Conversas ativas
 * - Tempo médio de resposta
 * - Taxa de satisfação
 * 
 * @example
 * ```typescript
 * <AuraConversationsWidget
 *   data={
 *     totalConversations: 500,
 *     activeConversations: 150,
 *     avgResponseTime: 45,
 *     satisfaction: 92.5
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { AuraConversationsData, WidgetProps } from '@/types';

/**
 * Props do widget de conversas Aura
 * @interface AuraConversationsWidgetProps
 * @extends WidgetProps
 */
interface AuraConversationsWidgetProps extends WidgetProps {
  /** Dados de conversas do Aura */
  data?: AuraConversationsData;
}

/**
 * Componente widget de conversas Aura
 * @param {AuraConversationsWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de conversas Aura
 */
const AuraConversationsWidget: React.FC<AuraConversationsWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Conversas Aura</Card.Title>
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
          <Card.Title>Conversas Aura</Card.Title>
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
        <Card.Title>Conversas Aura</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Total: {(data.totalConversations || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Ativas: {(data.activeConversations || 0).toLocaleString('pt-BR')}</div>
          {data.avgResponseTime && (
            <div>Tempo Médio: {data.avgResponseTime}s</div>
          )}
          {data.satisfaction && (
            <div>Satisfação: {data.satisfaction.toFixed(1)}%</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default AuraConversationsWidget;
