import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const BenchmarkComparison: React.FC<{ data: string[] }> = ({ data    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Comparação</Card.Title></Card.Header>
    <Card.Content><div className="text-gray-400">Comparação de períodos</div></Card.Content>
  </Card>);
