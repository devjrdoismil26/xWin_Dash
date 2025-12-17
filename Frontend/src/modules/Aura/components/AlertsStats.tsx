import React from 'react';
import { Card } from '@/shared/components/ui/Card';

export const AlertsStats: React.FC<{ alerts: string[] }> = ({ alerts    }) => (
  <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
      <Card.Content className="p-4 text-center" />
        <div className="text-2xl font-bold text-white">{alerts.length}</div>
        <div className="text-sm text-gray-400">Total</div>
      </Card.Content></Card></div>);
