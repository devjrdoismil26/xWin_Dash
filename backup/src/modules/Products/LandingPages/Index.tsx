import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
const LandingPagesIndex: React.FC = () => {
  return (
    <AuthenticatedLayout>
      <Head title="Landing Pages" />
      <div className="py-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Landing Pages</h1>
            <Button>Novo</Button>
          </div>
          <Card>
            <Card.Content>
              <p className="text-gray-600">Listagem de Landing Pages (em construção).</p>
            </Card.Content>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};
export default LandingPagesIndex;
