import React from 'react';
import Card from '@/shared/components/ui/Card';
interface CampaignStatsChartProps {
  data?: string[];
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }
const CampaignStatsChart: React.FC<CampaignStatsChartProps> = ({ data = [] as unknown[] 
   }) => (
  <Card />
    <Card.Header />
      <Card.Title>Gráfico da Campanha</Card.Title>
    </Card.Header>
    <Card.Content className="p-6 text-sm text-gray-500" />
      Gráfico indisponível nesta build.
    </Card.Content>
  </Card>);

export default CampaignStatsChart;
