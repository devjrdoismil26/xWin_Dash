import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { ReportsHeader } from './ReportsHeader';
import { ReportsList } from './ReportsList';
import { ReportsFilters } from './ReportsFilters';

export const AuraReports: React.FC = () => {
  const [filters, setFilters] = React.useState({});

  const [reports, setReports] = React.useState([]);

  return (
            <div className=" ">$2</div><ReportsHeader onCreateNew={() => {} />
      
      <Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Content className="p-6" />
          <ReportsFilters filters={filters} onChange={setFilters} / />
        </Card.Content></Card><ReportsList reports={reports} / />
    </div>);};
