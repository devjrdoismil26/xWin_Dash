import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const RequestInputNode = ({ config = {}, onChange }) => (
  <Card title="Solicitar Entrada">
    <div className="space-y-3">
      <Input value={config.placeholder || ''} onChange={(e) => onChange?.({ ...config, placeholder: e.target.value })} placeholder="Placeholder" />
    </div>
  </Card>
);
export default RequestInputNode;
