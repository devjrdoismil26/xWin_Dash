import React from 'react';
import Card from '@/components/ui/Card';
import { EmailMarketingData, WidgetProps } from '../../types';
interface EmailMarketingWidgetProps extends WidgetProps {
  data?: EmailMarketingData;
}
const EmailMarketingWidget: React.FC<EmailMarketingWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Email Marketing</Card.Title>
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
          <Card.Title>Email Marketing</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  const openRate = data.sent && data.opened ? ((data.opened / data.sent) * 100).toFixed(1) : '0';
  const clickRate = data.sent && data.clicked ? ((data.clicked / data.sent) * 100).toFixed(1) : '0';
  return (
    <Card>
      <Card.Header>
        <Card.Title>Email Marketing</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Enviados: {(data.sent || 0).toLocaleString('pt-BR')}</div>
          <div>Entregues: {(data.delivered || 0).toLocaleString('pt-BR')}</div>
          <div>Abertos: {(data.opened || 0).toLocaleString('pt-BR')} ({openRate}%)</div>
          <div>Cliques: {(data.clicked || 0).toLocaleString('pt-BR')} ({clickRate}%)</div>
          {data.unsubscribed && (
            <div className="text-red-600">
              Descadastros: {data.unsubscribed.toLocaleString('pt-BR')}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default EmailMarketingWidget;
