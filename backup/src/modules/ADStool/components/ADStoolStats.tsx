/**
 * Componente de Estatísticas do ADStool
 * Exibe métricas principais em cards responsivos
 */
import React from 'react';
import { Target, DollarSign, Eye, MousePointer } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { AnimatedCounter } from '@/components/ui/AdvancedAnimations';
import { ResponsiveGrid } from '@/components/ui/ResponsiveSystem';

interface ADStoolStatsProps {
  campaigns: any[];
  activeCampaigns: any[];
  pausedCampaigns: any[];
  getTotalSpend: () => number;
  getTotalImpressions: () => number;
  getTotalClicks: () => number;
  getAverageCTR: () => number;
  formatPercentage: (value: number) => string;
}

const ADStoolStats: React.FC<ADStoolStatsProps> = ({
  campaigns,
  activeCampaigns,
  pausedCampaigns,
  getTotalSpend,
  getTotalImpressions,
  getTotalClicks,
  getAverageCTR,
  formatPercentage
}) => {
  return (
    <ResponsiveGrid
      columns={{ xs: 1, sm: 2, lg: 4 }}
      gap={{ xs: '1rem', md: '1.5rem' }}
    >
      <Card>
        <Card.Content className="p-6 text-center">
          <div className="p-3 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Target className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedCounter
              value={campaigns.length}
              duration={2000}
            />
          </h3>
          <p className="text-gray-600">Campanhas</p>
          <div className="flex justify-center gap-2 mt-2">
            <Badge variant="success">{activeCampaigns.length} Ativas</Badge>
            <Badge variant="secondary">{pausedCampaigns.length} Pausadas</Badge>
          </div>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="p-6 text-center">
          <div className="p-3 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedCounter
              value={getTotalSpend()}
              duration={2000}
              prefix="R$ "
              decimals={2}
            />
          </h3>
          <p className="text-gray-600">Gasto Total</p>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="p-6 text-center">
          <div className="p-3 bg-purple-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Eye className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedCounter
              value={getTotalImpressions()}
              duration={2000}
            />
          </h3>
          <p className="text-gray-600">Impressões</p>
        </Card.Content>
      </Card>

      <Card>
        <Card.Content className="p-6 text-center">
          <div className="p-3 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <MousePointer className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            <AnimatedCounter
              value={getTotalClicks()}
              duration={2000}
            />
          </h3>
          <p className="text-gray-600">Cliques</p>
          <p className="text-sm text-gray-500 mt-1">
            CTR: {formatPercentage(getAverageCTR())}
          </p>
        </Card.Content>
      </Card>
    </ResponsiveGrid>
  );
};

export default ADStoolStats;
