import React from 'react';
import Card from '@/components/ui/Card';
const AuraStatsDistributionCharts = ({ data = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Card>
      <Card.Header>
        <Card.Title>Distribuição A</Card.Title>
      </Card.Header>
      <Card.Content className="p-6 text-sm text-gray-500">Indisponível</Card.Content>
    </Card>
    <Card>
      <Card.Header>
        <Card.Title>Distribuição B</Card.Title>
      </Card.Header>
      <Card.Content className="p-6 text-sm text-gray-500">Indisponível</Card.Content>
    </Card>
  </div>
);
export default AuraStatsDistributionCharts;
