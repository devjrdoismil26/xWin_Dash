import React from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
const ConditionKeywordNode = ({ config = {}, onChange }) => (
  <Card title="Condição por Palavra-chave">
    <div className="space-y-3">
      <Input value={config.keyword || ''} onChange={(e) => onChange?.({ ...config, keyword: e.target.value })} placeholder="Palavra-chave" />
    </div>
  </Card>
);
export default ConditionKeywordNode;
