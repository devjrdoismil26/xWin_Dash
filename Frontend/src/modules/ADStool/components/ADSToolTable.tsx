import React from 'react';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { RefreshCw, Eye, Play, Pause } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
}

interface ADSToolTableProps {
  campaigns: Campaign[];
  loading?: boolean;
  onRefresh?: () => void;
  onView?: (campaign: Campaign) => void;
  onToggleStatus?: (campaign: Campaign) => void;
}

export const ADSToolTable: React.FC<ADSToolTableProps> = ({ 
  campaigns,
  loading = false,
  onRefresh,
  onView,
  onToggleStatus,
}) => {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      google: 'bg-red-100 text-red-800',
      linkedin: 'bg-blue-100 text-blue-800',
      facebook: 'bg-indigo-100 text-indigo-800',
    };

    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card
      title="Campanhas"
      action={
        <Button variant="ghost" size="sm" onClick={onRefresh}>
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Nome</th>
              <th className="text-left py-3 px-4">Plataforma</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-left py-3 px-4">Orçamento</th>
              <th className="text-left py-3 px-4">Gasto</th>
              <th className="text-left py-3 px-4">Impressões</th>
              <th className="text-left py-3 px-4">Cliques</th>
              <th className="text-left py-3 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{campaign.name}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPlatformBadge(campaign.platform)}`}>
                    {campaign.platform}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="py-3 px-4">R$ {campaign.budget.toFixed(2)}</td>
                <td className="py-3 px-4">R$ {campaign.spent.toFixed(2)}</td>
                <td className="py-3 px-4">{campaign.impressions.toLocaleString()}</td>
                <td className="py-3 px-4">{campaign.clicks.toLocaleString()}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onView?.(campaign)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onToggleStatus?.(campaign)}>
                      {campaign.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {campaigns.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            Nenhuma campanha encontrada
          </div>
        )}
        
        {loading && (
          <div className="text-center py-8 text-gray-500">
            Carregando campanhas...
          </div>
        )}
      </div>
    </Card>
  );
};

export default ADSToolTable;
