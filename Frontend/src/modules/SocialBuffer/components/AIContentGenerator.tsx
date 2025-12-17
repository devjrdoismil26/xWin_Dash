import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
const AIContentGenerator = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Gerador com IA</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className=" ">$2</div><Textarea rows={4} value={prompt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)} placeholder="Descreva o conteúdo..." />
          <div className=" ">$2</div><Button onClick={ () => onGenerate?.(prompt) }>Gerar</Button></div></Card.Content>
    </Card>);};

export default AIContentGenerator;
