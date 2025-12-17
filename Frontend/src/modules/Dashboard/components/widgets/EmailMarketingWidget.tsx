/**
 * @module modules/Dashboard/components/widgets/EmailMarketingWidget
 * @description
 * Widget de email marketing.
 * 
 * Exibe m?tricas de campanhas de email marketing:
 * - Emails enviados e entregues
 * - Taxa de abertura (open rate)
 * - Taxa de cliques (click rate)
 * - Descadastros
 * 
 * @example
 * ```typescript
 * <EmailMarketingWidget
 *   data={
 *     sent: 10000,
 *     delivered: 9800,
 *     opened: 2500,
 *     clicked: 500,
 *     unsubscribed: 50
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { EmailMarketingData, WidgetProps } from '@/types';

/**
 * Props do widget de email marketing
 * @interface EmailMarketingWidgetProps
 * @extends WidgetProps
 */
interface EmailMarketingWidgetProps extends WidgetProps {
  /** Dados de email marketing */
  data?: EmailMarketingData;
}

/**
 * Componente widget de email marketing
 * @param {EmailMarketingWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de email marketing
 */
const EmailMarketingWidget: React.FC<EmailMarketingWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Email Marketing</Card.Title>
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
          <Card.Title>Email Marketing</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const openRate = (data as any).sent && (data as any).opened ? ((data.opened / (data as any).sent) * 100).toFixed(1) : '0';
  const clickRate = (data as any).sent && (data as any).clicked ? ((data.clicked / (data as any).sent) * 100).toFixed(1) : '0';
  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Email Marketing</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Enviados: {(data.sent || 0).toLocaleString('pt-BR')}</div>
          <div>Entregues: {(data.delivered || 0).toLocaleString('pt-BR')}</div>
          <div>Abertos: {(data.opened || 0).toLocaleString('pt-BR')} ({openRate}%)</div>
          <div>Cliques: {(data.clicked || 0).toLocaleString('pt-BR')} ({clickRate}%)</div>
          {data.unsubscribed && (
            <div className="Descadastros: {data.unsubscribed.toLocaleString('pt-BR')}">$2</div>
    </div>
  )}
        </div>
      </Card.Content>
    </Card>);};

export default EmailMarketingWidget;
