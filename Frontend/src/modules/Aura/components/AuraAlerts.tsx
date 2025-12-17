import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { AlertsList } from './AlertsList';
import { AlertsFilters } from './AlertsFilters';
import { AlertsStats } from './AlertsStats';

export const AuraAlerts: React.FC = () => {
  const [filters, setFilters] = React.useState({});

  const [alerts, setAlerts] = React.useState([]);

  return (
            <div className=" ">$2</div><AlertsStats alerts={alerts} / />
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header><Card.Title>Alertas</Card.Title></Card.Header>
        <Card.Content />
          <AlertsFilters filters={filters} onChange={setFilters} / />
        </Card.Content></Card><AlertsList alerts={alerts} / />
    </div>);};
