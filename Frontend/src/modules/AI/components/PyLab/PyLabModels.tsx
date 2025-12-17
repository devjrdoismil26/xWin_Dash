import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const PyLabModels: React.FC = () => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Modelos</Card.Title></Card.Header>
    <Card.Content><div className="text-gray-400">Lista de modelos disponíveis</div></Card.Content>
  </Card>);
