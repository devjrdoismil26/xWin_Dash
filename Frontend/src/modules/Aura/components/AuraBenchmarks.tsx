import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { BenchmarkMetrics } from './BenchmarkMetrics';
import { BenchmarkChart } from './BenchmarkChart';
import { BenchmarkComparison } from './BenchmarkComparison';

export const AuraBenchmarks: React.FC = () => {
  const [data, setData] = React.useState([]);

  return (
            <div className=" ">$2</div><Card className="backdrop-blur-xl bg-white/10 border-white/20" />
        <Card.Header><Card.Title>Benchmarks Aura</Card.Title></Card.Header>
        <Card.Content />
          <BenchmarkMetrics data={data} / />
        </Card.Content></Card><div className=" ">$2</div><BenchmarkChart data={data} / />
        <BenchmarkComparison data={data} / />
      </div>);};
