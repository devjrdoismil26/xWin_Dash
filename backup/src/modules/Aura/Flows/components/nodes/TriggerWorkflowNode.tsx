import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const TriggerWorkflowNode = ({ config = {}, onChange }) => (
  <Card title="Disparar Workflow">
    <div className="space-y-3">
      <Input value={config.workflow || ''} onChange={(e) => onChange?.({ ...config, workflow: e.target.value })} placeholder="Nome do workflow" />
    </div>
  </Card>
);
export default TriggerWorkflowNode;
