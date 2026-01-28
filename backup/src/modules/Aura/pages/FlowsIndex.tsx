import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import FlowCanvas from '@/modules/Aura/components/FlowCanvas.tsx';
const FlowsIndex: React.FC<{ auth?: any; nodes?: any[]; edges?: any[] }> = ({ auth, nodes = [], edges = [] }) => (
  <AuthenticatedLayout user={auth?.user}>
    <Head title="Fluxos" />
    <PageLayout title="Fluxos">
      <FlowCanvas nodes={nodes} edges={edges} />
    </PageLayout>
  </AuthenticatedLayout>
);
export default FlowsIndex;
