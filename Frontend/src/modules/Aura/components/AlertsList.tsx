import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const AlertsList: React.FC<{ alerts: string[] }> = ({ alerts    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Lista de Alertas</Card.Title></Card.Header>
    <Card.Content><div className="text-gray-400">{alerts.length} alertas</div></Card.Content>
  </Card>);
