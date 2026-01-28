import React from 'react';
import { Head } from '@inertiajs/react';
import CampaignForm from './components/CampaignForm.tsx';
import EnhancedCampaignForm from './components/EnhancedCampaignForm.tsx';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
type Campaign = {
  id?: number | string;
  name?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  project_id?: string | number | null;
};
interface CreateEditProps {
  campaign?: Campaign | null;
  isEditing?: boolean;
}
const CreateEdit: React.FC<CreateEditProps> = ({ campaign, isEditing = false }) => {
  const pageTitle = isEditing ? `Editar Campanha: ${campaign?.name || ''}` : 'Criar Nova Campanha';
  return (
    <AuthenticatedLayout>
      <Head title={pageTitle} />
      <PageLayout>
        <EnhancedCampaignForm campaign={campaign} onSuccess={() => {}} onCancel={() => {}} />
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default CreateEdit;
