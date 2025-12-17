import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { CohortTable } from './CohortTable';
import { CohortFilters } from './CohortFilters';
import { CohortChart } from './CohortChart';

export const AnalyticsCohortAnalyzer: React.FC = () => {
  const [filters, setFilters] = React.useState({});

  const [data, setData] = React.useState([]);

  return (
            <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header />
          <Card.Title>Análise de Coorte</Card.Title>
        </Card.Header>
        <Card.Content />
          <CohortFilters filters={filters} onChange={setFilters} / />
        </Card.Content></Card><CohortChart data={data} / />
      <CohortTable data={data} / />
    </div>);};
