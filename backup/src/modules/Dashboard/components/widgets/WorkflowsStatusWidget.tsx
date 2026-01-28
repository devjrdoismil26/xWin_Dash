import React from 'react';
import Card from '@/components/ui/Card';
import { WorkflowsStatusData, WidgetProps } from '../../types';
interface WorkflowsStatusWidgetProps extends WidgetProps {
  data?: WorkflowsStatusData;
}
const WorkflowsStatusWidget: React.FC<WorkflowsStatusWidgetProps> = ({ data = {}, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>Status Workflows</Card.Title>
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
          <Card.Title>Status Workflows</Card.Title>
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
        <Card.Title>Status Workflows</Card.Title>
      </Card.Header>
      <Card.Content className="p-4 text-sm">
        <div className="space-y-2">
          <div>Total: {(data.totalWorkflows || 0).toLocaleString('pt-BR')}</div>
          <div className="text-green-600">Ativos: {(data.activeWorkflows || 0).toLocaleString('pt-BR')}</div>
          <div className="text-blue-600">Concluídos: {(data.completedWorkflows || 0).toLocaleString('pt-BR')}</div>
          <div className="text-red-600">Falharam: {(data.failedWorkflows || 0).toLocaleString('pt-BR')}</div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default WorkflowsStatusWidget;
