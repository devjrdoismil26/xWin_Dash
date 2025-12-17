import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const CohortChart: React.FC<{ data: string[] }> = ({ data    }) => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
    <Card.Content className="p-4 h-64 flex items-center justify-center text-gray-400" />
      Gráfico de Coorte
    </Card.Content>
  </Card>);
