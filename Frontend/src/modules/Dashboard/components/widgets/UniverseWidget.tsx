/**
 * @module modules/Dashboard/components/widgets/UniverseWidget
 * @description
 * Widget de Universe (usuários e sistema).
 * 
 * Exibe métricas de usuários e sistema:
 * - Total de usuários
 * - Usuários ativos
 * - Novos usuários
 * - Taxa de retenção
 * 
 * @example
 * ```typescript
 * <UniverseWidget
 *   data={
 *     totalUsers: 5000,
 *     activeUsers: 3500,
 *     newUsers: 200,
 *     retention: 85.5
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { UniverseData, WidgetProps } from '@/types';

/**
 * Props do widget de Universe
 * @interface UniverseWidgetProps
 * @extends WidgetProps
 */
interface UniverseWidgetProps extends WidgetProps {
  /** Dados do Universe */
  data?: UniverseData;
}

/**
 * Componente widget de Universe
 * @param {UniverseWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de Universe
 */
const UniverseWidget: React.FC<UniverseWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Universe</Card.Title>
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
          <Card.Title>Universe</Card.Title>
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
        <Card.Title>Universe</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Total de Usuários: {(data.totalUsers || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Usuários Ativos: {(data.activeUsers || 0).toLocaleString('pt-BR')}</div>
          <div className="text-blue-600">Novos Usuários: {(data.newUsers || 0).toLocaleString('pt-BR')}</div>
          {data.retention && (
            <div>Retenção: {data.retention.toFixed(1)}%</div>
          )}
        </div>
      </Card.Content>
    </Card>);};

export default UniverseWidget;
