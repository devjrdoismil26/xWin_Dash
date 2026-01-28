import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
import Button from '@/components/ui/Button';
const TextGeneration: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4');
  const [result, setResult] = useState('');
  return (
    <PageLayout title="Geração de Texto">
      <Head title="Geração de Texto" />
      <Card>
        <Card.Content className="p-6 space-y-4">
          <div className="grid gap-3">
            <label className="text-sm font-medium">Prompt</label>
            <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Escreva o que você deseja gerar..." />
          </div>
          <div className="grid gap-3 max-w-xs">
            <label className="text-sm font-medium">Modelo</label>
            <Select 
              value={model} 
              onChange={(value) => setModel(value)}
              options={[
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
                { value: 'gemini-pro', label: 'Gemini Pro' },
                { value: 'claude-3', label: 'Claude 3' }
              ]}
            />
          </div>
          <Button onClick={() => setResult(`Resultado simulado para: ${prompt} (modelo ${model})`)}>Gerar</Button>
          {result && (
            <div className="p-4 bg-gray-50 rounded text-sm whitespace-pre-wrap">{result}</div>
          )}
        </Card.Content>
      </Card>
    </PageLayout>
  );
};
export default TextGeneration;
