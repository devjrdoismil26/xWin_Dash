import React from 'react';
import { Head } from '@inertiajs/react';
import CampaignActions from './components/CampaignActions.tsx';
import CampaignMetricsChart from './components/CampaignMetricsChart.tsx';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import PageLayout from '@/layouts/PageLayout';
type Campaign = {
  id: number | string;
  name: string;
  status?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  project_id?: string | number | null;
  creatives?: string[];
};
interface ShowProps {
  campaign: Campaign;
}
const formatDate = (dateString?: string) =>
  dateString
    ? new Date(dateString).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';
const Show: React.FC<ShowProps> = ({ campaign }) => {
  return (
    <AuthenticatedLayout>
      <Head title={`Campanha: ${campaign?.name || ''}`} />
      <PageLayout
        title={campaign?.name || 'Campanha'}
        actions={<Button onClick={() => { /* editar campanha */ }}>Editar Campanha</Button>}
      >
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Visão Geral</Card.Title>
            </Card.Header>
            <Card.Content className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-gray-900">{campaign.status}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Orçamento</p>
                <p className="font-medium text-gray-900">R$ {Number(campaign.budget || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Início</p>
                <p className="font-medium text-gray-900">{formatDate(campaign.start_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Data de Fim</p>
                <p className="font-medium text-gray-900">{formatDate(campaign.end_date)}</p>
              </div>
              <div className="md:col-span-2 lg:col-span-4">
                <p className="text-sm text-gray-500">Criativos</p>
                <p className="font-medium text-gray-900">{campaign.creatives ? campaign.creatives.join(', ') : 'N/A'}</p>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Ações</Card.Title>
            </Card.Header>
            <Card.Content>
              <CampaignActions campaign={campaign} />
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Métricas de Performance</Card.Title>
            </Card.Header>
            <Card.Content>
              <CampaignMetricsChart campaignId={campaign.id} />
            </Card.Content>
          </Card>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default Show;
