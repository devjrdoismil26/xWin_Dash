import React from 'react';
import Card from '@/components/ui/Card';
interface CampaignStatsChartProps {
  data?: any[];
}
const CampaignStatsChart: React.FC<CampaignStatsChartProps> = ({ 
  data = [] 
}) => (
  <Card>
    <Card.Header>
      <Card.Title>Gráfico da Campanha</Card.Title>
    </Card.Header>
    <Card.Content className="p-6 text-sm text-gray-500">
      Gráfico indisponível nesta build.
    </Card.Content>
  </Card>
);
export default CampaignStatsChart;
