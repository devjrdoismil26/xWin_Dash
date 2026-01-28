import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
const AIGenerationForm = ({ title = 'Geração de Conteúdo', onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('gpt-4');
  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate?.({ prompt, model });
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Escreva seu prompt..." />
        <Select value={model} onChange={(e) => setModel(e.target.value)}>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gemini-pro">Gemini Pro</option>
        </Select>
      </Card.Content>
      <Card.Footer>
        <Button onClick={handleSubmit}>Gerar</Button>
      </Card.Footer>
    </Card>
  );
};
export default AIGenerationForm;
