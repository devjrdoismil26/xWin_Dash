import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
const CreateEdit: React.FC<{ campaign?: any; isEditing?: boolean }> = ({ campaign, isEditing }) => {
  return (
    <AuthenticatedLayout>
      <Head title={isEditing ? 'Editar Campanha' : 'Criar Campanha'} />
      <PageLayout title={isEditing ? 'Editar Campanha' : 'Criar Campanha'}>
        <Card>
          <Card.Content className="p-6 space-y-3">
            <Input defaultValue={campaign?.name} placeholder="Nome" />
            <Textarea defaultValue={campaign?.content} placeholder="Conteúdo" />
            <Button>{isEditing ? 'Salvar' : 'Criar'}</Button>
          </Card.Content>
        </Card>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default CreateEdit;
