import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import Card from '@/components/ui/Card';
const AnalyticsScheduler: React.FC = () => (
  <AuthenticatedLayout>
    <Head title="Agendador de Relatórios" />
    <PageLayout title="Agendar Relatórios">
      <Card>
        <Card.Content className="p-6">Em breve</Card.Content>
      </Card>
    </PageLayout>
  </AuthenticatedLayout>
);
export default AnalyticsScheduler;
