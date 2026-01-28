import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import EnhancedAnalyticsDashboard from '@/modules/AI/components/EnhancedAnalyticsDashboard.tsx';
const UnifiedAIDashboard: React.FC<{ auth?: { user?: { id: string; name: string; email: string; }; }; data?: Record<string, unknown> }> = ({ auth, data }) => {
  return (
    <AuthenticatedLayout user={auth?.user}>
      <Head title="Dashboard Unificado de IA" />
      <PageLayout title="Dashboard de IA">
        <EnhancedAnalyticsDashboard data={data} />
      </PageLayout>
    </AuthenticatedLayout>
  );
};
export default UnifiedAIDashboard;
