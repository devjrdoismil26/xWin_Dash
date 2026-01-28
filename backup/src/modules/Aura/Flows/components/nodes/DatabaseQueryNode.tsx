import React from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
const DatabaseQueryNode = ({ config = {}, onChange }) => (
  <Card title="Consulta ao Banco">
    <div className="space-y-3">
      <Textarea value={config.query || ''} onChange={(e) => onChange?.({ ...config, query: e.target.value })} placeholder="SQL..." />
    </div>
  </Card>
);
export default DatabaseQueryNode;
