import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
const TextGeneration = ({ onGenerate }) => {
  const [text, setText] = useState('');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Geração de Texto</Card.Title>
      </Card.Header>
      <Card.Content>
        <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Escreva seu prompt..." />
      </Card.Content>
      <Card.Footer>
        <Button onClick={() => onGenerate?.(text)}>Gerar</Button>
      </Card.Footer>
    </Card>
  );
};
export default TextGeneration;
