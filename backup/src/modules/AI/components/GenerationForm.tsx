import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Select } from '@/components/ui/select';
const GenerationForm = ({ onSubmit, title = 'Nova Geração' }) => {
  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('text');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ prompt, type });
  };
  return (
    <Card>
      <Card.Header>
        <Card.Title>{title}</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-4">
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Descreva sua geração..." />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="text">Texto</option>
          <option value="image">Imagem</option>
          <option value="code">Código</option>
        </Select>
      </Card.Content>
      <Card.Footer>
        <Button onClick={handleSubmit}>Gerar</Button>
      </Card.Footer>
    </Card>
  );
};
export default GenerationForm;
