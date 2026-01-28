import React from 'react';
import Card from '@/components/ui/Card';
const LeadsTrendChart = ({ data = [] }) => (
  <Card>
    <Card.Header>
      <Card.Title>Tendência de Leads</Card.Title>
    </Card.Header>
    <Card.Content className="p-6 text-sm text-gray-500">
      Visualização do gráfico não disponível nesta build.
    </Card.Content>
  </Card>
);
export default LeadsTrendChart;
