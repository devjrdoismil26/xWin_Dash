import React from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
const AITextGenerationNode = ({ config = {}, onChange }) => (
  <Card title="IA: Geração de Texto">
    <div className="space-y-3">
      <Textarea value={config.prompt || ''} onChange={(e) => onChange?.({ ...config, prompt: e.target.value })} placeholder="Prompt" />
    </div>
  </Card>
);
export default AITextGenerationNode;
