import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/shared/components/ui/Card';
const CampaignShow: React.FC<{ campaign?: Record<string, any> }> = ({ campaign }) => (
  <AuthenticatedLayout />
    <Head title={`Campanha ${campaign?.id || ''}`} / />
    <PageLayout title={ campaign?.name || 'Campanha' } />
      <Card />
        <Card.Content className="p-6" />
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">{JSON.stringify(campaign, null, 2)}</pre>
        </Card.Content></Card></PageLayout>
  </AuthenticatedLayout>);

export default CampaignShow;
