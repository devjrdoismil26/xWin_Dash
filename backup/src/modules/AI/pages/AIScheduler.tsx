import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
const AIScheduler: React.FC<{ auth?: { user?: { id: string; name: string; email: string; }; } }> = ({ auth }) => {
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Agendador de IA" />
      <PageLayout title="Agendador de Gerações">
        <Card>
          <Card.Content className="p-6">Em breve</Card.Content>
        </Card>
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default AIScheduler;
