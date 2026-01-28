import React from 'react';
import Card from '@/components/ui/Card';
import { AIProcessingData, WidgetProps } from '../../types';
interface AIProcessingWidgetProps extends WidgetProps {
  data?: AIProcessingData;
}
const AIProcessingWidget: React.FC<AIProcessingWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Processamento IA</Card.Title>
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
          <Card.Title>Processamento IA</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500">
          Erro: {error}
        </Card.Content>
      </Card>
    );
  }
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>Processamento IA</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Itens Processados: {(data.processedItems || 0).toLocaleString('pt-BR')}</div>
          {data.accuracy && <div>Precisão: {data.accuracy.toFixed(1)}%</div>}
          {data.processingTime && <div>Tempo: {data.processingTime}s</div>}
          {data.status && (
            <div className={`font-medium ${getStatusColor(data.status)}`}>
              Status: {data.status}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
export default AIProcessingWidget;
