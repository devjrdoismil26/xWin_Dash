import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import KPIsDisplay from '@/modules/Analytics/components/KPIsDisplay.tsx';
const AnalyticsPage: React.FC<{ metrics?: any }> = ({ metrics = {} }) => (
  <AuthenticatedLayout>
    <Head title="Relatórios e Analytics" />
    <PageLayout title="Relatórios e Analytics">
      <KPIsDisplay metrics={metrics} />
    </PageLayout>
  </AuthenticatedLayout>
);
export default AnalyticsPage;
