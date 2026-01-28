import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import RemarkCampaignBuilder from './components/RemarkCampaignBuilder.tsx';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
const EmailMarketingRemarketingCampaignsPage: React.FC = () => {
  const { props } = usePage();
  const projectId = (props as any)?.auth?.user?.current_project_id ?? null;
  return (
    <AuthenticatedLayout>
      <Head title="Campanhas de Remarketing - Email Marketing" />
      <PageLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campanhas de Remarketing</h1>
            <p className="mt-1 text-sm text-gray-600">Crie e gerencie campanhas automatizadas de remarketing por email</p>
          </div>
          <Card>
            <Card.Content>
              <RemarkCampaignBuilder projectId={projectId} />
            </Card.Content>
          </Card>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default EmailMarketingRemarketingCampaignsPage;
