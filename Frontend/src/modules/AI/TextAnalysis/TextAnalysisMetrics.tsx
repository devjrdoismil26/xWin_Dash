import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const TextAnalysisMetrics: React.FC<{ results: unknown }> = ({ results    }) => (
  <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-4 text-center" />
        <div className="text-2xl font-bold text-white">85%</div>
        <div className="text-sm text-gray-400">Confiança</div>
      </Card.Content></Card></div>);
