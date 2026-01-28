import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const AIContentGenerator = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Gerador com IA</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-3">
          <Textarea rows={4} value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Descreva o conteúdo..." />
          <div className="text-right">
            <Button onClick={() => onGenerate?.(prompt)}>Gerar</Button>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
export default AIContentGenerator;
