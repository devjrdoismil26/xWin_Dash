/**
 * Componente de Campanhas Recentes do ADStool
 * Exibe lista das campanhas mais recentes
 */
import React from 'react';
import { Play, Pause, AlertCircle, Clock, BarChart3, Settings } from 'lucide-react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Tooltip from '@/components/ui/Tooltip';

interface ADStoolRecentCampaignsProps {
  campaigns: any[];
  formatCurrency: (value: number) => string;
}

const ADStoolRecentCampaigns: React.FC<ADStoolRecentCampaignsProps> = ({
  campaigns,
  formatCurrency
}) => {
  if (campaigns.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'PAUSED':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: any = {
      ACTIVE: 'success',
      PAUSED: 'secondary',
      FAILED: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Campanhas Recentes</Card.Title>
      </Card.Header>
      <Card.Content>
        <div className="space-y-4">
          {campaigns.slice(0, 5).map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                {getStatusIcon(campaign.status)}
                <div>
                  <h3 className="font-medium">{campaign.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {getStatusBadge(campaign.status)}
                    <Badge variant="outline">{campaign.platform}</Badge>
                    {campaign.daily_budget && (
                      <span className="text-sm text-gray-500">
                        {formatCurrency(campaign.daily_budget)}/dia
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip content="Ver analytics da campanha">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </Tooltip>
                <Tooltip content="Configurar campanha">
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ADStoolRecentCampaigns;
