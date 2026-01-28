import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
const TrendingTopicsManager = ({ onAdd }) => {
  const [topic, setTopic] = useState('');
  return (
    <Card>
      <Card.Header>
        <Card.Title>Tópicos em Alta</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="flex gap-2">
          <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Novo tópico" />
          <Button onClick={() => onAdd?.(topic)}>Adicionar</Button>
        </div>
      </Card.Content>
    </Card>
  );
};
export default TrendingTopicsManager;
