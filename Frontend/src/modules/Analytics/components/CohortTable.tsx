import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const CohortTable: React.FC<{ data: string[] }> = ({ data    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Content className="p-4" />
      <div className="text-gray-400 text-center">Tabela de Coorte</div>
    </Card.Content>
  </Card>);
