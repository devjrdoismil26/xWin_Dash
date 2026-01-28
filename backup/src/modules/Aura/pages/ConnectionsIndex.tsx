import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import PageLayout from '@/layouts/PageLayout';
import ConnectionTable from '@/modules/Aura/Connections/components/ConnectionTable.tsx';
const ConnectionsIndex: React.FC<{ auth?: any; connections?: any[] }> = ({ auth, connections = [] }) => (
  <AuthenticatedLayout user={auth?.user}>
    <Head title="Conexões" />
    <PageLayout title="Conexões">
      <ConnectionTable connections={connections} />
    </PageLayout>
  </AuthenticatedLayout>
);
export default ConnectionsIndex;
