import React from 'react';
import Card from '@/shared/components/ui/Card';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Eye, RefreshCw, Play, Pause } from 'lucide-react';
import { formatDate, formatCurrency } from '@/shared/utils';

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  budget: number;
  spend: number;
  ctr: number; }

interface ADSToolTableProps {
  campaigns: Campaign[];
  loading?: boolean;
  onRefresh???: (e: any) => void;
  onView??: (e: any) => void;
  onToggleStatus??: (e: any) => void;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

export const ADSToolTable: React.FC<ADSToolTableProps> = ({ campaigns,
  loading,
  onRefresh,
  onView,
  onToggleStatus,
   }) => {
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',};

    return colors[status] || 'bg-gray-100 text-gray-800';};

  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      google: 'bg-red-100 text-red-800',
      linkedin: 'bg-blue-100 text-blue-800',
      facebook: 'bg-indigo-100 text-indigo-800',};

    return colors[platform.toLowerCase()] || 'bg-gray-100 text-gray-800';};

  return (
        <>
      <Card
      title="Campanhas"
      action={ <Button variant="ghost" size="sm" onClick={onRefresh } />
      <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''} `} / />
        </Button>
  }
  >
      <div className=" ">$2</div><table className="w-full" />
          <thead className="backdrop-blur-xl bg-white/10 border-white/20 border-b" />
            <tr />
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Plataforma</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orçamento</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gasto</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CTR</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th></tr></thead>
          <tbody className="divide-y" />
            {loading ? (
              <tr />
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500" />
                  Carregando...
                </td>
      </tr>
    </>
  ) : campaigns.length === 0 ? (
              <tr />
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500" />
                  Nenhuma campanha encontrada
                </td>
      </tr>
    </>
  ) : (
              campaigns.map((campaign: unknown) => (
                <tr key={campaign.id} className="hover:bg-gray-50" />
                  <td className="px-4 py-3 text-sm font-medium">{campaign.name}</td>
                  <td className="px-4 py-3" />
                    <Badge className={getPlatformBadge(campaign.platform) } />
                      {campaign.platform}
                    </Badge></td><td className="px-4 py-3" />
                    <Badge className={getStatusBadge(campaign.status) } />
                      {campaign.status}
                    </Badge></td><td className="px-4 py-3 text-sm">{formatCurrency(campaign.budget)}</td>
                  <td className="px-4 py-3 text-sm">{formatCurrency(campaign.spend)}</td>
                  <td className="px-4 py-3 text-sm" />
                    <span className="font-medium">{campaign.ctr}%</span></td><td className="px-4 py-3 text-right" />
                    <div className=" ">$2</div><Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => onToggleStatus?.(campaign.id)  }>
                        {campaign.status === 'active' ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={ () => onView?.(campaign.id)  }>
                        <Eye className="h-4 w-4" /></Button></div></td></tr>
              ))
            )}
          </tbody></table></div>
    </Card>);};
