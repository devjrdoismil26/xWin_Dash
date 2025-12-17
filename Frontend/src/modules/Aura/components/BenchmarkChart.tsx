import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const BenchmarkChart: React.FC<{ data: string[] }> = ({ data    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Gráfico</Card.Title></Card.Header>
    <Card.Content><div className="h-64 flex items-center justify-center text-gray-400">Gráfico de Benchmark</div></Card.Content>
  </Card>);
