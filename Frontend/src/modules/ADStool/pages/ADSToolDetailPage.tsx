import React from 'react';
import { router } from '@inertiajs/react';
import { ModuleLayout, PageHeader, Card } from '@/shared/components/ui';
import { useADSToolRefactored } from '../hooks/useADSTool';
import { Badge } from '@/shared/components/ui/Badge';
import { TrendingUp, DollarSign, MousePointer, Eye, Target } from 'lucide-react';

export const ADSToolDetailPage: React.FC<{ id: string }> = ({ id    }) => {
  const { getCampaign } = useADSToolRefactored();

  const [campaign, setCampaign] = React.useState<any>(null);

  React.useEffect(() => {
    if (id) {
      getCampaign(id).then(setCampaign);

    } , [id]);

  if (!campaign) return <div>Carregando...</div>;

  return (
        <>
      <ModuleLayout />
      <PageHeader
        title={ campaign.name }
        description={`Campanha ${campaign.platform}`}
        backButton
      / />
      <div className=" ">$2</div><div className=" ">$2</div><Card title="Informações" icon={ Target } />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">Nome</label>
                <p className="font-medium">{campaign.name}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Plataforma</label>
                <Badge>{campaign.platform}</Badge></div><div>
           
        </div><label className="text-sm text-gray-500">Status</label>
                <Badge variant={ campaign.status === 'active' ? 'success' : 'default' } />
                  {campaign.status}
                </Badge></div><div>
           
        </div><label className="text-sm text-gray-500">Orçamento</label>
                <p className="font-medium">{campaign.budget}</p></div></Card>

          <Card title="Performance" />
            <div className=" ">$2</div><div className=" ">$2</div><div className=" ">$2</div><Eye className="h-4 w-4" />
                  <span className="text-sm font-medium">Impressões</span></div><p className="text-2xl font-bold">{campaign.impressions?.toLocaleString()}</p></div><div className=" ">$2</div><div className=" ">$2</div><MousePointer className="h-4 w-4" />
                  <span className="text-sm font-medium">Cliques</span></div><p className="text-2xl font-bold">{campaign.clicks?.toLocaleString()}</p></div><div className=" ">$2</div><div className=" ">$2</div><TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">CTR</span></div><p className="text-2xl font-bold">{campaign.ctr}%</p></div><div className=" ">$2</div><div className=" ">$2</div><DollarSign className="h-4 w-4" />
                  <span className="text-sm font-medium">Gasto</span></div><p className="text-2xl font-bold">{campaign.spend}</p></div></Card></div><div className=" ">$2</div><Card title="Detalhes" />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">Criado em</label>
                <p className="font-medium">{new Date(campaign.created_at).toLocaleDateString('pt-BR')}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Atualizado em</label>
                <p className="font-medium">{new Date(campaign.updated_at).toLocaleDateString('pt-BR')}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Conta</label>
                <p className="font-medium">{campaign.account_name}</p></div></Card>

          <Card title="Objetivos" />
            <div className=" ">$2</div><div>
           
        </div><label className="text-sm text-gray-500">Objetivo</label>
                <p className="font-medium">{campaign.objective || 'Conversões'}</p></div><div>
           
        </div><label className="text-sm text-gray-500">Público-alvo</label>
                <p className="font-medium">{campaign.target_audience || 'Geral'}</p></div></Card></div></ModuleLayout>);};

export default ADSToolDetailPage;
