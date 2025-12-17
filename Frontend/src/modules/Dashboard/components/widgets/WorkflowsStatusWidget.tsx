/**
 * @module modules/Dashboard/components/widgets/WorkflowsStatusWidget
 * @description
 * Widget de status de workflows.
 * 
 * Exibe métricas de workflows e automações:
 * - Total de workflows
 * - Workflows ativos
 * - Workflows concluídos
 * - Workflows que falharam
 * 
 * @example
 * ```typescript
 * <WorkflowsStatusWidget
 *   data={
 *     totalWorkflows: 100,
 *     activeWorkflows: 25,
 *     completedWorkflows: 70,
 *     failedWorkflows: 5
 *   } *   loading={ false }
 * / />
 * ```
 * 
 * @since 1.0.0
 */
import React from 'react';
import Card from '@/shared/components/ui/Card';
import { WorkflowsStatusData, WidgetProps } from '@/types';

/**
 * Props do widget de status de workflows
 * @interface WorkflowsStatusWidgetProps
 * @extends WidgetProps
 */
interface WorkflowsStatusWidgetProps extends WidgetProps {
  /** Dados de status de workflows */
  data?: WorkflowsStatusData;
}

/**
 * Componente widget de status de workflows
 * @param {WorkflowsStatusWidgetProps} props - Props do widget
 * @returns {JSX.Element} Widget de status de workflows
 */
const WorkflowsStatusWidget: React.FC<WorkflowsStatusWidgetProps> = ({ data = {} as any, loading, error }) => {
  if (loading) {
    return (
        <>
      <Card />
      <Card.Header />
          <Card.Title>Status Workflows</Card.Title>
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
          <Card.Title>Status Workflows</Card.Title>
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
        <Card.Title>Status Workflows</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm" />
        <div className=" ">$2</div><div>Total: {(data.totalWorkflows || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Ativos: {(data.activeWorkflows || 0).toLocaleString('pt-BR')}</div>
          <div className="text-blue-600">Concluídos: {(data.completedWorkflows || 0).toLocaleString('pt-BR')}</div>
          <div className="text-red-600">Falharam: {(data.failedWorkflows || 0).toLocaleString('pt-BR')}</div>
      </Card.Content>
    </Card>);};

export default WorkflowsStatusWidget;
