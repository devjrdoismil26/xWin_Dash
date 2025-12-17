import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const FunnelMetrics: React.FC<{ steps: string[] }> = ({ steps    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Métricas</Card.Title></Card.Header>
    <Card.Content><div className="text-gray-400">Métricas do funil</div></Card.Content>
  </Card>);
