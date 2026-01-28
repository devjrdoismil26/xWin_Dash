import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const SetVariableNode = ({ config = {}, onChange }) => (
  <Card title="Definir Variável">
    <div className="space-y-3">
      <Input value={config.key || ''} onChange={(e) => onChange?.({ ...config, key: e.target.value })} placeholder="Chave" />
      <Input value={config.value || ''} onChange={(e) => onChange?.({ ...config, value: e.target.value })} placeholder="Valor" />
    </div>
  </Card>
);
export default SetVariableNode;
