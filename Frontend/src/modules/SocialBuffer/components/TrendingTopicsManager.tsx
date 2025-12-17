import React, { useState } from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';
const TrendingTopicsManager = ({ onAdd }) => {
  const [topic, setTopic] = useState('');

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Tópicos em Alta</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className=" ">$2</div><Input value={topic} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)} placeholder="Novo tópico" />
          <Button onClick={ () => onAdd?.(topic) }>Adicionar</Button></div></Card.Content>
    </Card>);};

export default TrendingTopicsManager;
