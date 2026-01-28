import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const GoToFlow = ({ config = {}, onChange }) => (
  <Card title="Ir para Fluxo">
    <div className="space-y-3">
      <Input value={config.flowId || ''} onChange={(e) => onChange?.({ ...config, flowId: e.target.value })} placeholder="ID do fluxo" />
    </div>
  </Card>
);
export default GoToFlow;
