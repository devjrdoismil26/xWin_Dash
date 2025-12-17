/**
 * Componente de Campanhas Recentes do ADStool
 * Exibe lista das campanhas mais recentes
 */
import React from 'react';
import { Play, Pause, AlertCircle, Clock, BarChart3, Settings } from 'lucide-react';
import Card from '@/shared/components/ui/Card';
import Badge from '@/shared/components/ui/Badge';
import Button from '@/shared/components/ui/Button';
import Tooltip from '@/shared/components/ui/Tooltip';
import { AdsCampaign } from '../types';

interface ADStoolRecentCampaignsProps {
  campaigns: AdsCampaign[];
  formatCurrency: (value: number) => string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: any) => void;
  onChange?: (e: any) => void; }

const ADStoolRecentCampaigns: React.FC<ADStoolRecentCampaignsProps> = ({ campaigns,
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
    } ;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'secondary' | 'destructive'> = {
      ACTIVE: 'success',
      PAUSED: 'secondary',
      FAILED: 'destructive',};

    return (
              <Badge variant={ variants[status] || 'secondary' } />
        {status}
      </Badge>);};

  return (
        <>
      <Card />
      <Card.Header />
        <Card.Title>Campanhas Recentes</Card.Title>
      </Card.Header>
      <Card.Content />
        <div className="{campaigns.slice(0, 5).map((campaign: unknown) => (">$2</div>
            <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
           
        </div><div className="{getStatusIcon(campaign.status)}">$2</div>
                <div>
           
        </div><h3 className="font-medium">{campaign.name}</h3>
                  <div className="{getStatusBadge(campaign.status)}">$2</div>
                    <Badge variant="outline">{campaign.platform}</Badge>
                    {campaign.daily_budget && (
                      <span className="{formatCurrency(campaign.daily_budget)}/dia">$2</span>
      </span>
    </>
  )}
                  </div></div><div className=" ">$2</div><Tooltip content="Ver analytics da campanha" />
                  <Button variant="outline" size="sm" />
                    <BarChart3 className="w-4 h-4" /></Button></Tooltip>
                <Tooltip content="Configurar campanha" />
                  <Button variant="outline" size="sm" />
                    <Settings className="w-4 h-4" /></Button></Tooltip>
      </div>
    </>
  ))}
        </div>
      </Card.Content>
    </Card>);};

export default ADStoolRecentCampaigns;
