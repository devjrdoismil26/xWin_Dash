/**
 * @module modules/Dashboard/components/widgets/AIProcessingWidget
 * @description
 * Widget de processamento de Inteligência Artificial.
 * 
 * Exibe métricas de processamento e análise de IA:
 * - Itens processados
 * - Precisão/Accuracy
 * - Tempo de processamento
 * - Status do processamento (processing, completed, error)
 * 
 * @example
 * ```typescript
 * <AIProcessingWidget
 *   data={
 *     processedItems: 1250,
 *     accuracy: 95.5,
 *     processingTime: 45,
 *     status: 'completed'
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { AIProcessingData, WidgetProps } from '@/types';

/**
 * Props do widget de processamento de IA
 * @interface AIProcessingWidgetProps
 * @extends WidgetProps
 */
interface AIProcessingWidgetProps extends WidgetProps {
  /** Dados de processamento de IA */
  data?: AIProcessingData;
}

/**
 * Componente widget de processamento de IA
 * @param {AIProcessingWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de processamento de IA
 */
const AIProcessingWidget: React.FC<AIProcessingWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Processamento IA</Card.Title>
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
          <Card.Title>Processamento IA</Card.Title>
        </Card.Header>
        <Card.Content className="p-4 text-red-500" />
          Erro: {error}
        </Card.Content>
      </Card>);

  }
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'processing': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    } ;

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Processamento IA</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Itens Processados: {(data.processedItems || 0).toLocaleString('pt-BR')}</div>
          {data.accuracy && <div>Precisão: {data.accuracy.toFixed(1)}%</div>}
          {data.processingTime && <div>Tempo: {data.processingTime}s</div>}
          {data.status && (
            <div className={`font-medium ${getStatusColor(data.status)} `}>
          Status: 
        </div>{data.status}
            </div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default AIProcessingWidget;
