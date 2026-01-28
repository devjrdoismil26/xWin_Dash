import React, { useState, useCallback } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import CreativePreview from './components/CreativePreview.tsx';
interface ShowProps {
  creative: {
    id: number | string;
    name: string;
    type?: string;
    campaign?: { id: number | string; name: string } | null;
    created_at?: string;
  };
}
const Show: React.FC<ShowProps> = ({ creative }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const pageTitle = `Criativo: ${creative?.name || ''}`;
  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    // API integration will be implemented in future iteration
    setTimeout(() => setIsDeleting(false), 500);
  }, []);
  return (
    <AuthenticatedLayout>
      <Head title={pageTitle} />
      <PageLayout title={pageTitle} actions={<Button onClick={handleDelete} variant="destructive" loading={isDeleting}>Excluir</Button>}>
        <div className="space-y-6">
          <Card>
            <Card.Header>
              <Card.Title>Detalhes</Card.Title>
            </Card.Header>
            <Card.Content className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nome</p>
                <p className="font-medium text-gray-900">{creative.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-medium text-gray-900">{creative.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Campanha</p>
                <p className="font-medium text-gray-900">{creative.campaign?.name || 'Nenhuma'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Criado em</p>
                <p className="font-medium text-gray-900">{creative.created_at ? new Date(creative.created_at).toLocaleDateString('pt-BR') : '-'}</p>
              </div>
            </Card.Content>
          </Card>
          <Card>
            <Card.Header>
              <Card.Title>Pré-visualização</Card.Title>
            </Card.Header>
            <Card.Content>
              <CreativePreview creative={creative} />
            </Card.Content>
          </Card>
        </div>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default Show;
