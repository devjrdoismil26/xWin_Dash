import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Button from '@/components/ui/Button';
import CreativeGallery from './components/CreativeGallery.tsx';
export interface Creative {
  id: number | string;
  name: string;
  type?: string;
  preview_url?: string;
}
interface IndexProps {
  creatives?: Creative[];
}
const Index: React.FC<IndexProps> = ({ creatives = [] }) => (
  <AuthenticatedLayout>
    <Head title="Gerenciar Criativos de Anúncio" />
    <PageLayout
      title="Criativos"
      actions={
        <Link href={route('adstool.creatives.create')}>
          <Button variant="primary">Novo Criativo</Button>
        </Link>
      }
    >
      <CreativeGallery
        creatives={creatives}
        onEdit={(c: Creative) => router.visit(route('adstool.creatives.edit', c.id))}
        onDelete={() => {}}
      />
    </PageLayout>
  </AuthenticatedLayout>
);
export default Index;
