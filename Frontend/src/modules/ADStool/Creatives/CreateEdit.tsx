import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import CreativeForm from './components/CreativeForm.tsx';
export interface Creative {
  id?: number | string;
  name?: string;
  type?: 'image' | 'video' | 'text';
  content_text?: string;
  campaign_id?: number | string | null;
}
interface CreateEditProps {
  creative?: Creative | null;
  campaigns?: Array<{ id: number | string; name: string }>;
  isEditing?: boolean;
}
const CreateEdit: React.FC<CreateEditProps> = ({ creative, campaigns = [], isEditing = false }) => {
  const pageTitle = isEditing ? `Editar Criativo: ${creative?.name || ''}` : 'Criar Novo Criativo';
  return (
    <AuthenticatedLayout>
      <Head title={pageTitle} />
      <PageLayout title={pageTitle}>
        <CreativeForm creative={creative} campaigns={campaigns} />
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default CreateEdit;
