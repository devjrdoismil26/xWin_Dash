import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const FunnelSteps: React.FC<{ steps: string[]; onChange?: (e: any) => void }> = ({ steps }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Etapas</Card.Title></Card.Header>
    <Card.Content><div className="text-gray-400">Configure as etapas do funil</div></Card.Content>
  </Card>);
