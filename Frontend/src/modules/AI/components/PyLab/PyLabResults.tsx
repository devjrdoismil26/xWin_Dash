import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const PyLabResults: React.FC<{ results: unknown }> = ({ results    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Header><Card.Title>Resultados</Card.Title></Card.Header>
    <Card.Content />
      <pre className="text-sm text-gray-300">{JSON.stringify(results, null, 2)}</pre>
    </Card.Content>
  </Card>);
