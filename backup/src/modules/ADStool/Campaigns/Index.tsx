import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Button from '@/components/ui/Button';
import CampaignTable from './components/CampaignTable.tsx';
type Campaign = {
  id: number | string;
  name: string;
  description?: string;
  status?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
};
interface IndexProps {
  campaigns?: Campaign[];
}
const Index: React.FC<IndexProps> = ({ campaigns = [] }) => {
  return (
    <AuthenticatedLayout>
      <Head title="Gerenciar Campanhas de Anúncio" />
      <PageLayout
        title="Campanhas"
        actions={
          <Link href={route('adstool.campaigns.create')}>
            <Button variant="primary">Nova Campanha</Button>
          </Link>
        }
      >
        <CampaignTable
          campaigns={campaigns}
          onEdit={(c: Campaign) => router.visit(route('adstool.campaigns.edit', c.id))}
          onDelete={(c: Campaign) => router.visit(route('adstool.campaigns.delete', c.id))}
          onViewDetails={(c: Campaign) => router.visit(route('adstool.campaigns.show', c.id))}
        />
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default Index;
