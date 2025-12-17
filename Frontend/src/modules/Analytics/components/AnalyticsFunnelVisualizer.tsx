import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { FunnelChart } from './FunnelChart';
import { FunnelSteps } from './FunnelSteps';
import { FunnelMetrics } from './FunnelMetrics';

export const AnalyticsFunnelVisualizer: React.FC = () => {
  const [steps, setSteps] = React.useState([]);

  return (
            <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header />
          <Card.Title>Visualizador de Funil</Card.Title>
        </Card.Header>
        <Card.Content />
          <FunnelChart steps={steps} / />
        </Card.Content></Card><div className=" ">$2</div><FunnelSteps steps={steps} onChange={setSteps} / />
        <FunnelMetrics steps={steps} / />
      </div>);};
