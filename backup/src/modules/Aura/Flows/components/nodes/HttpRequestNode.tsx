import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
const HttpRequestNode = ({ config = {}, onChange }) => (
  <Card title="Requisição HTTP">
    <div className="space-y-3">
      <Input value={config.url || ''} onChange={(e) => onChange?.({ ...config, url: e.target.value })} placeholder="URL" />
      <Textarea value={config.body || ''} onChange={(e) => onChange?.({ ...config, body: e.target.value })} placeholder="Corpo (JSON)" />
    </div>
  </Card>
);
export default HttpRequestNode;
