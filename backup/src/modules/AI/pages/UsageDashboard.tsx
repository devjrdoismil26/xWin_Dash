import React from 'react';
import PageLayout from '@/layouts/PageLayout';
import AIDashboard from '@/modules/AI/components/AIDashboard.tsx';
const UsageDashboard = ({ metrics = {} }) => (
  <PageLayout title="Uso de IA">
    <AIDashboard metrics={metrics} />
  </PageLayout>
);
export default UsageDashboard;
