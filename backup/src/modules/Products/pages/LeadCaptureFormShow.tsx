import React from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import Card from '@/components/ui/Card';
const LeadCaptureFormShow: React.FC<{ form?: any }> = ({ form }) => (
  <AuthenticatedLayout>
    <Head title={`Formulário - ${form?.name || ''}`} />
    <div className="py-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <Card.Content>
            <pre className="text-xs bg-gray-100 p-3 rounded overflow-auto">{JSON.stringify(form || {}, null, 2)}</pre>
          </Card.Content>
        </Card>
      </div>
    </div>
  </AuthenticatedLayout>
);
export default LeadCaptureFormShow;
