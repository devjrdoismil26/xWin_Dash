import React from 'react';
import Card from '@/components/ui/Card';
import { SocialBufferData, WidgetProps } from '../../types';
interface SocialBufferWidgetProps extends WidgetProps {
  data?: SocialBufferData;
}
const SocialBufferWidget: React.FC<SocialBufferWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Social Buffer</Card.Title>
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
          <Card.Title>Social Buffer</Card.Title>
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
        <Card.Title>Social Buffer</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Agendados: {(data.scheduledPosts || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Publicados: {(data.publishedPosts || 0).toLocaleString('pt-BR')}</div>
          {data.engagement && (
            <div>Engajamento: {data.engagement.toFixed(1)}%</div>
          )}
          {data.reach && (
            <div>Alcance: {data.reach.toLocaleString('pt-BR')}</div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default SocialBufferWidget;
