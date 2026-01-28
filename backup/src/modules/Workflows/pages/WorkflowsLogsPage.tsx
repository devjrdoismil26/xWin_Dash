import React from 'react';
import Card from '@/components/ui/Card';
const WorkflowsLogsPage: React.FC = () => (
  <div className="py-6">
    <Card>
      <Card.Header>
        <Card.Title>Logs de Workflows</Card.Title>
      </Card.Header>
      <Card.Content>
        <p>Histórico de execuções.</p>
      </Card.Content>
    </Card>
  </div>
);
export default WorkflowsLogsPage;
