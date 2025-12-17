import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const AnswerDisplay: React.FC<{ answer: unknown }> = ({ answer    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Resposta</Card.Title></Card.Header>
    <Card.Content><p className="text-white">{answer?.text}</p></Card.Content>
  </Card>);
