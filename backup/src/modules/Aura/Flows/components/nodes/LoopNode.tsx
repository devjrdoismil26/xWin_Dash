import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const LoopNode = ({ config = {}, onChange }) => (
  <Card title="Repetição">
    <div className="space-y-3">
      <Input type="number" value={config.times || 0} onChange={(e) => onChange?.({ ...config, times: parseInt(e.target.value) || 0 })} placeholder="Número de vezes" />
    </div>
  </Card>
);
export default LoopNode;
