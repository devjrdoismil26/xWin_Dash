import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const SendMediaNode = ({ config = {}, onChange }) => (
  <Card title="Enviar Mídia">
    <div className="space-y-3">
      <Input value={config.url || ''} onChange={(e) => onChange?.({ ...config, url: e.target.value })} placeholder="URL da mídia" />
    </div>
  </Card>
);
export default SendMediaNode;
