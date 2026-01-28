import React from 'react';
import { Head } from '@inertiajs/react';
import { AuthenticatedLayout } from '@/layouts/AuthenticatedLayout';
import { PageLayout } from '@/shared/components/layout/PageLayout';
import { Card } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  start_date: string;
  end_date: string;
}

interface ShowProps {
  campaign: Campaign;
}

const Show: React.FC<ShowProps> = ({ campaign }) => {
  return (
    <>
      <AuthenticatedLayout />
      <Head title={`Campanha: ${campaign?.name || ''}`} />
      <PageLayout
        title={campaign?.name || 'Campanha'}
        actions={
          <Button onClick={() => { /* editar campanha */ }}>
            Editar Campanha
          </Button>
        }
      >
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
          </Card.Content>
        </Card>
      </PageLayout>
    </>
  );
};

export default Show;
